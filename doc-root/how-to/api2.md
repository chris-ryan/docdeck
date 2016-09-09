### Connecting a Node/Express app to MongoDB

Just like with everything else in the node universe, there are pre-built packages for interacting with MongoDB databases.

Let's install the most basic: mongodb in our Express API app.

```npm install mongodb --save```

Create a new file in the root of our project called: db-connect.js

```
var mongoClient = require('mongodb');

mongoClient.connect('mongodb://dev.diabcre.cloud:27017/mongotest', function(err, db) {
    console.log("Connected to MongoDB!");

    db.close();
});
```

run ```node db-connect.js``` and you should see the connection message outputted to your console.

### Retrieving a document

Within our client connect function, we'll use the findOne() method retrieve a patient...

```
var mongoClient = require('mongodb');

mongoClient.connect('mongodb://dev.diabcre.cloud:27017/mongotest', function(err, db) {
    console.log("Connected to MongoDB!");

    var collection = db.collection('patients');
    collection.findOne({'id': '10003'}, function(err, doc) {
        console.log(doc.id + " - " + doc.name.family + ", " + doc.name.given);
    });

    db.close();
});
```