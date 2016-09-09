### What is Node.JS?

Node is basically a wrapper around the V8 JavaScript runtime (the same one that chrome uses to run JS) to allow us to build JS applications outside of the browser.

Ryan Dhal created Node in 2009. 

**NodeJS is event-driven, non-blocking and modular.**

#### Event-driven
Being event-driven, almost all of the code in Node is written to either respond to an event or itself fire an event. This is essentially the mechanism by which different Node objects and modules communicate. It also makes Node apps scale very well as many connections can be handled concurrently but if there is no work to be done, Node is sleeping.

#### Blocking vs non-blocking calls
Blocking calls, or synchronous calls, are those where control doesn't return to the application until the requested operation is completed. This commonly occurs in I/O operations. For example, when reading and writing using a blocking call, the application must wait until the read or write operation is done before further logic can be processed. This means that the application is idle while waiting for a potentially lengthy operation to complete.

Non-blocking calls are those where control returns to the application almost immediately, before waiting for the operation to complete. This is called asynchronous programming. The completion of the operation is often communicated to the application via a callback routine. Node uses non-blocking calls along with a queue to priotize tasks and a dispatcher to assign tasks to workers and pass back completed packages.

## Callbacks
A callback is a piece of executable code that runs in response to a certain event. 
It is passed as an argument to other code that will execute the callback when specified. 

- Function call
- call back to a function that deals with the results (with an error handler)

For example, 

if B requires A to be done first.

```
var doSomething = function(input1, callback) {
    var newThing = Math.random()*input1;
    if isNaN {
        callback(new Error("Not a number"));
    }
    else {
        callback (null, newThing);
    }
}

var handleResults = function(error, results) {
 if (error == undefined) {
    console.log("something has been done")
 }
}

doSomething(param1, param2, handleResults);
where handleResults has been previously defined as a function. 
```

Note: As a convention, the callback function is usually the last parameter passed.
Also, an error handler should always be the first value passed to the callback.

For simple callback anonymous functions are common but named functions make it easier down the track for debugging and maintining code.

## Modules


### Using Modules
Properties and functions from modules are made available using require()

You can require an entire module: ```var express = require('express');```
.. or just a single variable of function: ``` var maxAge = require('express').maxAge;```

### Getting Modules
There are three main sources of modules that can be used in Node apps.
####1. Built-in: 
While there are a few functions in the global namespace, there are many built-in modules that still need to be explicitly required in your code.
some of these include: fs, http, crypto, os.

####2. Other files within your project. 
Each of your .js files is considered to be a node module and as such can be required.
To access you need to pass the relative path as a parameter to the require() function.
eg: ```require('./somefolder/somefile')``` or ```require('../somefile')```

To make variables available to other files, you need to assign them to the module.exports object.
eg: 
```
var doSomething = function(i, callback) {
    ...
}
module.exports.doSomething = doSomething;
```

Just like with other modules you can require individual variables from your own files using dot notation.

####3. Node Package Manager
Third-party modules are available by using ```npm install module-name --save``` which downloads all the required files into the node_modules folder. (--save adds the modules to the dependencies list in your package.json file)
You can then require them by simply referring to their name just like with built-in modules, and node knows to go looking in that folder.
eg: ```var mongodb = require('mongodb');
You can still import individual files by referring to their relative path but be careful as you may miss out on required dependencies.

You can find third-party npm packages using the commandline: ```npm search <search terms>```
or on the [web][1].


The general principle of Node is that operations should never block. 
This is at the heart of what delivers the high concurrency and effciency.

### Installing Node.js
#### MacOS and Windows
Go to https://nodejs.org/en/ and download and install the "current" installer package.


### Hello World
Create a new file (hello.js) and open it with your favourite editor

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

>> Pop over to the node docs page for the [http module][2] and see the objects within the http.ClientRequest class it considers to be events.

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


### Events vs Callbacks
In the callback model, you make a request and provide a function to be called when the request is completed. (Request/Reponse)
Whereas with the Events approach, we provide functions to invoke on specific events (Publish/Subscribe). 

Typically the callback approach involves an all-or-nothing scenario where the response to the call is either an error, indicating that the call has failed, or the callback function indicating success.
In the events scenario, an error is emmitted as a separate event, allowing you to pass an error instead of any item events or after some item events have been emmitted, allowing the possibility of a 'partial success' scenario.

You can listen to multiple events on an object or have multiple functions that listen to the same event
### Event emmitters

Just as events can be triggered in the DOM (click, submit, load, hover etc..), many objects in Node emit events.
Most of these inherit from the [EventEmitter][3] class.

For example, in our Hello World app, the ```http.createServer(function(request, response) {``` method is passed the *request* event 
which it has inherited from the net.Server class. You can view the [Node API][4] to see the way this results in the on and emit functions being called.

Let's say we wanted to create our own custom EvenEmitter
that can emit and listen for the following events: error, warn, info

```
var EventEmitter = require('events').EventEmitter;

//listen for error event
var logger = new EventEmitter();
logger.on('error', function(message) {
    console.log('ERROR: ' + message);
});
//emit error event
logger.emit('error', 'amount is too high');


```

The code that is subscribing to events, calls the ```emitter.on(event, listener)``` function, specifiying the event being subscribed to.
The code publishing events calls the ```emitter.emit(event, [args])``` function, specfying the event being emmitted.

The *events* are simply Strings and can be any value. They can also be *emitted* with zero or more arguments.

### Streams

In keeping with Node's core principle of better data I/O efficiency, streams were developed to allow us to handle data piece by piece (or chunk by chunk) as its being transferred. 

Streams extend the EventEmitter class to provide functionality for managing data flow such as network traffic or file I/O.

The two most-common instances of Streams are ReadableStream and WriteableStream

#### ReadableStream
includes:
- boolean - indicating whether the stream is readable
- events (data, end, error, close) - emitted when new data arrives or when it stops
- functions: pause(), resume(), destroy(), pipe() - that can act on the stream.

#### WritableStream

includes: 
- boolean - indicating whether the stream is writable
- events (drain, error, close, pipe) - emitted when its safe to write to a stream or when data has been piped to a readableStream
- functions: write(), end(), destroy(), destroySoon() - that can act on the stream.

The power of streams is seen when ReadableStream and WriteableStream are used together, using the pipe() function.

Let's modify our hello.js app to take in a request as a readable stream and output it back to the browser as a writeable stream.

```
var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200); 
    request.on('readable', function() {
        var chunk = null;
        while(null !== (chunk = request.read())) {
            response.write(chunk);
            console.log(chunk.toString());
        }
    });
   request.on('end', function() {
        response.end();
   });

}).listen(8080);
```

run the app and from another terminal window, POST a message using the curl command:
```curl -d 'hello' http://localhost:8080

Take a look at your node console and you should see the message outputted to the console.


####The pipe() method

It's quite common in node that you would want to read a stream then write it to a writeable stream. For this, Node provides the pipe() helper method.

We can rewrite the above code using the pipe() method as:

```
var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200); 
    request.pipe(response);
}).listen(8080);
```

As you can see, pipe() automatically takes a readable stream and *pipes* it into a writable destination. 
syntax: ```readablestream.pipe(writablestream);```

> Note: Its possible to pipe into multiple destinations by setting up a chain of pipe streams.
eg: ```readablestream.pipe(x).pipe(y);```


### Working with file streams

Say we wanted to read the contents from a file and stream it into another file.

```
var fs = require('fs');

var oldFile = fs.createReadStream("readme.md"); //ReadStream
var newFile = fs.createWriteStream("readme-copy.md"); //WriteStream

file.pipe(newFile);
```

You can pipe any read stream into any write stream. For example, combining the two examples above would allow you read from the HTTP request and pipe it into a file

```
var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
var newFile = fs.createWriteStream("response-log.txt");
request.pipe(newFile);

request.on('end', function() {
response.end('uploaded!');
});

}).listen(8080);

```

To test, in terminal, cd to somewhere with a file that you can send via a HTTP request using curl:
curl --upload-file somefile.txt http://localhost:8080

...then have a look in the directory where your hello.js app was run from and you'll now see a copy of the file!.

A simpler example using *request()* to read a webpage, then pipe it into a file...
```request('http://www.unimelb.edu.au/').pipe(fs.createWriteStream('unimelb.html'));```
... or chaining the pipe() commands to compress the file...
```request('http://www.unimelb.edu.au/').pipe(zlib.createGzip()).pipe(fs.createWriteStream('unimelb.gz'));```

#### Notifying the end-user of progress
Because node is reading and writing the file in chunks as it arrives, we can easily refer to those chunks to provide a notification of upload progress.

In the earlier example, we already have access to the properties we need via the fs & http modules. We just need to compare the total size of the file (content length header) against the sum of chunks sizes as they come in.
for this, [fs.read][5] provides us with the length property (for chunk size in bytes) and the http module gives us access to the http message headers. As part of the HTTP protocol, the size of a message (along with other properties) can be send in the message's header. curl, like any good client, obliges us by sending this. In this case, the header we're interested in is [content-length][6]

```
var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) {
var newFile = fs.createWriteStream("response-log.txt");
//find out how big the file is
var fileBytes = request.headers['content-length'];
var uploadedBytes = 0;

request.on('readable', function() {
    var chunk = null;
    while(null !== (chunk = request.read())){
        uploadedBytes += chunk.length;
        var progress = (uploadedBytes / fileBytes) * 100;
        response.write("progress: " + parseInt(progress, 10) + "%\n");
    }
})

request.pipe(newFile);

request.on('end', function() {
response.end('uploaded!');
});

}).listen(8080);
```

[1]: https://www.npmjs.com/ "NPM - Find packages" 
[2]: https://nodejs.org/api/http.html "NodeJS Docs - http"
[3]: https://nodejs.org/api/events.html#events_class_eventemitter "NodeJS API - EventEmitter"
[4]: https://nodejs.org/api/net.html#net_event_connection "NodeJS API - net.Server"
[5]: https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback "NodeJS API - fs.read"
[6]: https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields "Wikipedia - HTTP headers"