# Vireo Magic 8-Ball
[![Running Vireo Magic 8-Ball Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://vireo-node-eightball.glitch.me/eightball)
[![Running Vireo Magic 8-Ball README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/rajsite/vireo-node-eightball#vireo-magic-8-ball)

This example shows how the `vireo` npm package can be used to run a WebVI in a Node.js application. In this example we create a web server using the Express framework.

When the user visits a specific endpoint, the WebVI is run using inputs from the HTTP Request and the WebVI returns an output included in the HTTP Response.

## Dependencies
- LabVIEW NXG 2.0 Beta
- Node.js 6.X (Required for testing locally)
- Glitch.com (Option for deploying)
- Postman (Optional tool for testing API endpoints)

## Testing the live demo
The `Main.gviweb` for the Magic 8-Ball can be seen as follows:

![Main.gviweb showing a simple diagram that randomly returns a string from a set of possible strings](https://cdn.glitch.com/cfea0d4a-79ae-41a6-85f6-bba822e5a247%2Feightball_screenshot.png?1495405756951)

The value passed to the Input control is ignored and a random string is returned in the output.

The Express web application is configured to accept HTTP requests at the endpoint `/eightball`. The endpoint uses the parameter `input` from the url query string to pass to the WebVI. The string returned by the WebVI is added to an object as the parameter `output` and returned as JSON to the user.

The code for the Express `/eightball` endpoint can be seen as follows:

```javascript
app.get("/eightball", function (request, response) {
  var input = request.query.input;
  createVireoResponse(input, function (output) {
    response.send({
      output: output
    });
  });
});
```

To access the WebVI we create a url that matches the endpoint:

[`https://vireo-node-eightball.glitch.me/eightball`](https://vireo-node-eightball.glitch.me/eightball)

When you visit the url in a browser you should see a randomly generated result similar to the following:

```json
{"output":"It is certain"}
```

Note: Here we ignore the query string parameter named input as we know the WebVI itself will ignore it as well.

Note: For a simple GET request like this example we can test the url by visting it in the browser. For more complex requests, such as requests requiring custom headers or HTTP Methods other than GET, a tool such as [Postman](https://www.getpostman.com/) may be used to test.

