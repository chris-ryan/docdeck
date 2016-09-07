The socket.io library abstracts websockets with fallbacks to support browsers that don't support websockets
```
var express = require('exress');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
    client.on('join', function(name) {
        client.nickname = name;
    });
    console.log('Client connected...');
    //emit the message event on the client
    client.emit('messages', {hello: 'world' });
    //listen for message events
    client.on('messages', function(data){
        var nickname = client.nickname;
        //broadcast message to all other clients
        client.broadcast.emit("messages", nickname + ": " + message);
        //send the same mesasge back to client
        client.emit("messages", nickname + ": " + message);
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080);


in the html you need to load the socket.io library and connect to the server...
```
<script src="/socket.io/socket.io.js"></script>

<script>
    var server = io.connect('http://localhost:8080');
    server.on('connect', function(data) {
        $('#status').html('Connected to chattr');
        nickname = prompt("What is your nickname?");
        server.emit('join', nickname);
    });
</script>

<script>
    var socket = io.connect(http://localhost:8080');
    $('#chat_form').submit(function(e){
        var message = $('#chat_input').val();
        //emit messages event on the server
        socket.emit('messages', message);
    });

    socket.on('messages', function(data) {
        insertMessage(data);
    });
</script>
```
Socket's broadcast property allows us to emit to all clients connected to a server (such as in the case of a chatroom).
```socket.broadcast.emit("messsage", "Hello");```

To configure a socket client within a JS app, instead of referencing socket.io.js in a <script> tag as above, we just need to 
```require (socket.io-client);```

### Persisting data

```
var express = require('exress');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();
// client.set("message1", "hello, this is Bob");

var messages = [];
var storeMessage = function(name, data){
    var message = JSON.stringify({name: name, data: data});
    /*messages.push({name: name, data: data}); //add message to end of array
    if (messages.length > 10) {
        messages.shift();
    }*/
    redisClient.lpush("messages", message, function(err, response){
        redisClient.ltrim("messages", 0, 9);
    });
}

io.sockets.on('connection', function(client) {
    client.on('messages', function(message) {
        client.get("nickname", function(error, name) {
            client.broadcast.emit("messages", name + ": " + message);
            client.emit("messages", name + ": " + message);
            storeMessage(name, message);
        });
    });

    client.on('join', function(name) {
        redisClient.lrange("messages", 0, -1, function(err, messages){
            messages = messages.reverse();
            messages.forEach(function(message){
                message = JSON.parse(message);
                client.emit("messages", message.name + ": " + message.data);
            });
        });

        //notify other clients a chatter has joined
        client.broadcast.emit("add chatter", name);
        redisClient.smembers('names', function(err, names){
            names.forEach(function(name){
                client.emit('add chatter', name);
            });
        });
        redisClient.sadd("chatters", name);
    });

    //remove chatter when they disconnect
    client.on('disconnect', function(name){
        client.get('nickname', function(err, name){
            client.broadcast.emit("remove chatter", name);
            redisClient.srem("chatters", name);
        });
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080);
```

and in the html
```
socket.on('add chatter', function(name) {
    var chatter = $('<li>'+ name + '</li>').data('name', name);
    $('#chatters').append(chatter);
});

// remove client when they disconnect
server.on('remove chatter', fucntion(name) {
    $('#chatters li[data-name=' + name + ']').remove();
});