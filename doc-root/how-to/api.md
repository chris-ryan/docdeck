## Using Express to build a MongoDB API

Express is a framework built with NodeJS, much in the same way that Aurelia is a framework built with JavaScript.

Its syntax is easier to read and write than pure NodeJS and it has built-in methods for supporting a basic MVC app.

### Creating a basic JSON API using express

Instead of an app that returns a html-formated web page, we're going to make a simple api that returns JSON.

Our api is going to be a BMI calculator, that reads in a user's weight and height from the HTTP GET request, and responds with the calculated BMI in JSON.

Express is installed as a Node package

Let's create a new Node.JS project: 
and run: ```npm init```
> when asked, just leave the "test command:" empty for now.

Install the Express package via npm
```npm install express --save```

##### The main file

When we ran ```npm init``` we were prompted for the name of our main file (default: index.js). 

The convention for Node apps is to create this file in the root of our project.

Let's do that now and put in a reference to our newly install module.

```
var express = require ('express'),
    app = express();
```
Here we've assigned the Express module to the variable *express*, then declared a variable call *app* which will contain the object returned by the Express framework.
As Express is essentially a framework that returns a Node app, this variable is *app*tly named (boom-tish!)

Express has a very straight-forward syntax for [routing requests][1].
The get() method, routes the HTTP GET requests by matching requests to a callback function based on the supplied url

A response method is used to send a response to the client.

#### Response methods
| Method | Description |
| ----------| ------ |
| download() | Prompts for a file to be downloaded |
| json() | Sends a JSON response |
| redirect() | Redirects a request to another url |
| render() | Renders a view template |
| send() | Sends a response (can be pretty much anything) |
| sendFile() | Sends a file as an octet stream |
| sendStatus() | Sends the response status code |

Let's add a few more lines to index.js... 

- using get() to assign the values of weight and height when an HTTP GET request is made to the /bmi/ url
- parse the supplied variables and calculate the bmi using some basic JavaScript
- using json() to return the result in JSON syntax.

```
app.get("/bmi/:weight/:height", function (req, res) {
    var weight = parseInt(req.params.weight);
    var height = parseFloat(req.params.height);

    var result = weight / Math.pow(height, 2);
    res.json({ result });
});
```

Now Let's tell express to create an HTTP server using the app object and  listen for connections.
```
var server = app.listen(8080, function() {
    console.log ('Server started on port 8080');
});
```

Save our file, run it using ```node index.js``` 

Now in your browser go to http://localhost:8080/bmi/yourweight/yourheight
(where *yourweight* is your weight in kgs and *yourheight* is your heght in metres.)

[1]: http://expressjs.com/en/starter/basic-routing.html "ExpressJS - Basic Routing"