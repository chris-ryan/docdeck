### Mongoose
Another way of connecting to a Mongo Database with node, is by using the Mongoose module.
Mongoose extends on the mongodb module to make working the more complex data models easier through the use of schemas.

A schema, is like a table definition. It allows to use features we're used to in relational databases to ensure database integrity like required fields and strict data types.
A mongoose schema is basically a key-value pair, where the *key* is the property name we want and the *value* is the Schema data type. 

The schema data types Mongoose allows are:
- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array

#### An example mongoose schema
```
var PatientSchema = new Schema({
    id: {
        type: String,
        required: true;
    },
    name: {
        family: {
            type: String,
            required: true
        },
        given: {
            type: String,
            required: true
        }
    },
    gender: {
        type: String
    },
    birthDate: {
        type: Date
    }
});
```

### Models
Much like in a typical Model-View-Controller architecture, in Mongoose, we work with instances of models to refernce our data.
ie. When you execute a query on the database, a model is returned with the properties deined by the schema.

Models are declared by simply passing the model constructor, a name for the model, and a schema to associate it with.
```
var Patient = mongoose.model('Patient', PatientSchema);
```
This then allows us to refer to the returned data as if it was a native JS object
```
Patient[0].surname = "bob";
```

### Queries

The syntax for querying in Mongoose is very similar as for when using the mondodb module, just slightly cleaner.

In Mongodb...

```
var listPatients = function(db, callback) {
    var list = db.collection('patients').find({}, {"_id": false}).toArray(function(err, docs) {
            callback(docs);
    });
};

```
is now in Mongoose...
```
var listPatients = function(db, callback) {
  Patient.find({}, '-_id', function(error, results) { 
    callback(null, results);
  });
};
```