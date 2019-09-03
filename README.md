# Archived
This repo is archived. Examples of running WebVIs as node.js apps was moved to the WebVICLI experiment in https://github.com/rajsite/webvi-experiments

## Vireo Magic 8-Ball
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

The code for the Express `/eightball` endpoint can be seen in [server.js](https://github.com/rajsite/vireo-node-eightball/blob/0ed93bc88d761ddf251b9c9155e48a90fa5d4624/server.js#L77) and is reproduced as follows:

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

In this example we ignore the query string parameter named input as we know the WebVI itself will ignore it as well.

For a simple GET request like this example we can test the url by visting it in the browser. For more complex requests, such as requests requiring custom headers or HTTP Methods other than GET, a tool such as [Postman](https://www.getpostman.com/) may be used to test.

## Setup
1. Clone the [rajsite/vireo-node-eightball](https://github.com/rajsite/vireo-node-eightball) repository to your machine.
2. Open `Eightball\Eightball.lvproject`.
3. Open `Main.gviweb` and click the **Run** button.
    
    Note: The Node.js environment may bypass Cross-Origin Resource Sharing restrictions unlike the LabVIEW embedded browser possibly resulting in differences in behavior.
4. Build the web application.  
  a. Open `Eightball.gcomp`.  
  b. On the **Document** tab, click **Build**.

## Hosting the WebVI on a Node.js server
Deploy the `vireo-node-eightball` folder to a Node.js environment of your choice.

### Hosting on a local Node.js server
1. Open a command prompt in the `vireo-node-eightball` directory.
2. If this is the first time that the server is being tested then install the dependencies using the command `npm install`
3. Start the server using the command `npm run start`
4. The port number will be printed to the console, ie:
    ```
    Your app is listening on port PORTNUMBER
    ```
5. Open a web browser to `http://localhost:PORTNUMBER`

### Hosting on glitch.com
1. Create a fork of the [rajsite/vireo-node-eightball](https://github.com/rajsite/vireo-node-eightball) repository
2. Modify the fork to update the WebVI behavior or the server.js file
3. Push your changes into your Github fork so they are visible online
4. Create an account on glitch.com if you do not have one already
5. Create a new glitch, click the glitch settings, click Advanced Options, and click Import from Github
6. Enter the name of your repository fork, ie `mygithubusername/vireo-node-eightball` and press ok
7. After the import is complete press the Show button to see your deployed version of the project

![Workflow for forking the repo and uploading to glitch.com](https://cdn.glitch.com/cfea0d4a-79ae-41a6-85f6-bba822e5a247%2FPublishToGlitch.gif?1495423790844)
