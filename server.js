// server.js
// calls a WebVI using the vireo runtime

// init project
var express = require('express');
var app = express();
var fs = require('fs');

// load library to measure response time (optional)
var responseTime = require('response-time');
app.use(responseTime());

// Library to render markdown documents, used to render README.md as the index page (optional)
var remarkable = require('express-remarkable');
app.engine('md', remarkable(app));
app.set('views', __dirname);
app.get('/', function (req, res) {
  res.render('README.md');
});

// load an XMLHTTPRequest implementation into the global scope
// this allows Vireo to make network requests in the node environment
// optional if the WebVI does not utilize the HTTP gvis
global.XMLHttpRequest = require('xhr2').XMLHttpRequest;

// load the Vireo Constructor Function
var Vireo = require('vireo');

// load the via source code
var viName = 'Main%2Egviweb';
var viaPath = 'Eightball/Builds/Web Server/Configuration1/Eightball/Main.via.txt';
var viaWithEnqueue = fs.readFileSync(viaPath, "utf8");
var viaEnqueueInstruction = viaWithEnqueue.match(/^enqueue.*$/mg, "")[0];
var via = viaWithEnqueue.replace(/^enqueue.*$/mg, "");

// create a new Vireo instance
var vireo = new Vireo();

// register some logging functions (only used for debugging)
vireo.eggShell.setPrintFunction(console.log);
vireo.eggShell.setPrintErrorFunction(console.error);

// load the via code into the runtime
vireo.eggShell.loadVia(via);

app.get("/eightball", function (request, response) {
  // take the input parameter of the query string and write it to the String Control named Input
  var input = JSON.stringify(request.query.input);
  vireo.eggShell.writeJSON(viName, 'dataItem_Input', input);
  
  // run the via code and allow it to complete asynchronously
  vireo.eggShell.loadVia(viaEnqueueInstruction);
  (function runExecuteSlicesAsync() {
    var output;
    var status = vireo.eggShell.executeSlices(1000);
    
    if (status > 0) {
      setImmediate(runExecuteSlicesAsync);
    } else {
      
      // take the value of the String Indicator named Output and return it as the response of the request
      output = JSON.parse(vireo.eggShell.readJSON(viName, 'dataItem_Output'));
      response.send({
        output: output
      });
    }
  }());
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
