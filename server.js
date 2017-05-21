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
var viaCode = fs.readFileSync(viaPath, "utf8");

// does the bulk of the Vireo work by creating a Vireo instance, loading the via text, and executing the runtime
// this function assumes that the WebVI front panel has a String Control named 'Input' and a String Indicator named 'Output'
var createVireoResponse = function (input, callback) {
  // create a new Vireo instance
  var vireo = new Vireo();

  // register some logging functions (only used for debugging)
  vireo.eggShell.setPrintFunction(console.log);
  vireo.eggShell.setPrintErrorFunction(console.error);

  // load the via code into the runtime
  vireo.eggShell.loadVia(viaCode);
  
  // prepare the input string to write to the runtime
  // we encode the string as JSON in order to safely pass the string into the Vireo runtime
  // the runtime will decode the JSON before using so the result is that the string should pass through unchanged
  var inputJSON = JSON.stringify(input);
  vireo.eggShell.writeJSON(viName, 'dataItem_Input', inputJSON);
  
  // execute the WebVI asynchronously to allow network requests
  // in general WebVIs should return quickly to avoid blocking the endpoint on the server
  (function runExecuteSlicesAsync() {
    var output;
    var status = vireo.eggShell.executeSlices(1000);
    if (status > 0) {
      setImmediate(runExecuteSlicesAsync);
    } else {
      // when the WebVI has finished running extract the value of the String Indicator named 'Output'
      // extract as JSON to safely pass the string between Vireo and JS environment
      // we then parse as JSON output so the end result is the string is passed unchanged to the callback function
      var outputJSON = vireo.eggShell.readJSON(viName, 'dataItem_Output');
      var output = JSON.parse(outputJSON);
      callback(output);
    }
  }());
};

// the express endpoint that is serviced with Vireo
// in this example we take the url query parameter named input as the string to pass to the WebVI
// and we return a JSON object that has a single property called output which is the output string returned by the WebVI

// we can of course customize which part of the request we pass to vireo, ie url query parameters, request body, headers, etc
// as well as customize the HTTP method used, return format, etc
app.get("/eightball", function (request, response) {
  var input = request.query.input;
  createVireoResponse(input, function (output) {
    response.send({
      output: output
    });
  });

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
