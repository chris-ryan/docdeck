### Node Chapter 2


### Packages

All npm packages contain a file, usually in the project root, called *package.json*.
This file contains metadata relevant to the project including:
- name
- description
- version
- author
- dependencies
- repository location
- main file

The easiest way to create one, is to execute ```npm init``` from the root of our project's folder.

Let's create a new project: 
and run: ```npm init```
> when asked, just leave the "test command:" empty for now.

#### Working with other packages

Install the Express package via npm
```npm install express --save```

Take a look at your package.json file and in the newly created node_modules folder.
You'll see that "express" has now been added to the list of dependencies and a heap of modules have been downloaded and installed into node_modules.
> Express is a pretty big framework. Most Node packages only contain a handful of modules.


### The main file

When we ran npm init where were prompted for the name of our main file (default: index.js). The convention for Node apps is to create this file in the root of our project.
Let's do that now and put in a reference to our newly install module.

```
var express = require ('express'),
app = express();
```
Here we've assigned the Express module to the variable *express*, then declared a variable call *app* which will contain the object returned by the Express framework.
As Express is essentially a framework that returns a Node app, this variable is *app*tly named (boom-tish!)

Let's add a few more lines to index.js, using Express' set() function to define some settings.

```
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
```

Let's add a few lines to index.js to create an HTTP server using the app object and tell it to listen for connections.
```
var server = app.listen( function() {
    console.log ('The server is listening');
});
```

### Routing & templates

```
var request = require('request');
var url = require('url');

app.get ('/tweets/:username', function(req, response) {
        var username = req.params.username;

        options = {
            protocol: "http",
            host: api.twitter.com,
            pathname: '/1/statuses/user_timeline.json',
            query: { screen_name: username, count: 10}
        }

        var twitterUrl = url.format(options);
        request(url, function(err, res, body) {
            var tweets = JSON.parse(body);
            response.locals = {tweets: tweets, name: username};
            response.render('tweets.ejs') //template engine
        });

});
```






### Connecting Node to MongoDB
Install the Node - MongoDB module
```npm install mongodb --save```

```
var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200); //outputs the status code in the header
    response.write("Hello world, this is Node.JS"); // the body of the response
    response.end(); //close the connection

}).listen(8080);
```

* From your terminal/command line run the server using:
```node hello.js```
* In another terminal/command line window, hit the server to view the response:
```curl http://localhost:8080```
* ctrl + c to stop the node server process.

## Events

Look at the earlier Hello World code.

When its executed, Node goes through the code and registers any known events. 
In this case it registers  *request*.

>> Pop over to the node docs page for the [http module][1] and see the objects within the http.ClientRequest class it considers to be events.

Node then goes into an event loop. Where its continuously checking for the registered events.

In our code, that means node is listening for a 'request' to come in.
When the request is received, node then runs the code in the callback (reponse)'

Let's modify our earlier hello.js, adding a line to log the incoming request by referring to the request.url property.

```
var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200);
    console.log("Incoming request:" + request.url);
    response.write("Hello world, this is Node.JS");
    response.end();

}).listen(8080);
```
Fire up the node hello.js, go to localhost:8080 in your browser and take a look in your terminal to see the console output.

You'll notice two requests, one for "/" and another for "/favicon.ico". Don't stress about that last one. Whenever you load a url modern browsers look for a corresponding favicon to put a pretty icon in their tabs.

Now try putting in something after "localhost:8080/" in your browser's url bar: Eg: http://localhost:8080/bobsyouruncle

You'll see "Incoming request:/bobsyouruncle" now gets logged to the console. 

This is at the core of how we can use the url property to differentiate incoming requests and serve up different pages in response. 

### Event emmitters

Just as events can be triggered in the DOM (click, submit, load, hover etc..), many objects in Node emit events.
Most of these inherit from the [EventEmitter][2] constructor.
For example, in our Hello World app, the ```http.createServer(function(request, response) {``` method is passed the request event

[1]: https://nodejs.org/api/http.html "NodeJS Docs - http"
[2]: https://nodejs.org/api/events.html#events_class_eventemitter "NodeJS Docs - EventEmitter"