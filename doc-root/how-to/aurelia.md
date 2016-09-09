Working with Aurelia
=============

[TOC]

#### Installing Dependencies
#####MacOS and Windows
Go to https://nodejs.org/en/ and download and install the "current" installer package.

#####Ubuntu Linux
```bash
apt-get install nodejs
apt-get install npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

#### Install the Aurelia CLI tool
```bash
sudo npm install -g aurelia-cli
```
Install JavaScript package manager jspm
```bash
sudo npm install jspm@0.16.15 -g
```
####Creating a new Aurelia project
From terminal, navigate to the folder that you keep your development projects in and run the command:
```bash 
au new
```
- Give the project a name
- Would you like to use the default setup?: 1 - (Default ESNext)
- Would you like to create this project?: 1 - (Yes)
- Would you like to install the project dependencies? - 1 (Yes)

To view the project, navigate into the new project's folder and run:
```bash
au run --watch
```
Then browse to http://127.0.0.1:9000 to test that the environment works. you should see "Welcome to Aurelia!"

>Note: to exit the server enter `ctrl-c` in the terminal

#### How does it work?

The user interface is comprised of two parts: the view (html) and the view-model (JavaScript).

From the downloaded starter kit, open `index.html` in your preferred code editor.

The aurelia-bootstrapper module scans `index.html`, looking for an element with the *aurelia-app* attribute to load the view into. In this case it's the `<body>` tag:

```
<!DOCTYPE html>
<html>
  <head>
    <title>Aurelia</title>
    <link rel="stylesheet" href="styles/styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body aurelia-app>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      SystemJS.import('aurelia-bootstrapper');
    </script>
  </body>
</html>
```
*index.html*

>Note: by default, Aurelia loads `app.html` and `app.js` unless a different name is specified as a value of the Aurelia-app attribute.
	>E.g. `<body aurelia-app="othername">` would look for `othername.js` and `othername.html`


The view...
```
<template>
	<h1>${message}</h1>
</template>
``` 
*src/app.html*


... references the variable `$message` defined in the view-model.
```
export class App {
	message = 'Welcome to Aurelia!';
}
```
*src/app.js*
####Creating a new user interface

Install Twitter's Bootstrap plugin (to make our app look pretty with minimal effort)

```jspm install bootstrap```

Create the view model

in the src folder, create a new view-model: `patient.js` and insert the following:

```
export class Patient {
	constructor () {
		this.clinicId = "1001";
		this.lastName = "Smithers";
		this.firstName = "Waylon";
	}
}
```
*src/patient.js*

Here we've just manually defined a patient with fixed properties to get something up on the screen. Later we'll look at connecting the view to a data source.

####Creating the view template

In the same folder, create the corresponding view `patient.html` and insert the following:

```
<template>
	<div class="jumbotron">
		<h2>Patient List</h2>
	</div>
	<table class = table>
		<tr>
			<td>${clinicId}</td>
			<td>${lastName}, ${firstName}</td>
		</tr>
	</table>
</template>
```
*src/patient.html*

####Create a route to the page

When building an application with multiple pages, we can use Aurelia’s navigation model to configure a *router* to define *routes* to the different views. This allows us to dynamically create navigation without having to code in links on every view.

As Aurelia first looks at the app view/view-model by default, we’ll just configure our routes in there.

Open `src/app.js` in your preferred code editor. Inside the App class definition, replace the message variable with:

```
export class App {
	configureRouter(config, router) {
	config.title = 'Aurelia Prototype';
	config.map([
		{route: ['','patient'], name:'patient', moduleId: './patient', nav: true, title: 'Patient List' }
		])
	this.router = router;
	}
}
```
*src/app.js*

To call the router from the default view, we add to app.html...
```
<template>
    <router-view></router-view>
</template>

```

For further tutorials see the [Aurelia Quick Start](http://aurelia.io/hub.html#/doc/article/aurelia/framework/latest/quick-start) guide

## Dealing with data
### Populating a page with external data
#### Install the aurelia-fetch-client plugin
```bash
npm install aurelia-fetch-client
```
#### Add aurelia-fetch-client to the list of dependencies in your package manifest
In `aurelia_project/aurelia.json` insert the following line under "dependencies"
```
aurelia-fetch-client,
```
<i class="icon-file"></i> Create a sample data file (`patients.json`) in the root of your aurelia project:
```
{
    "id" : "10001",
    "name": 
    {
	    "family": "Bloggs",
	    "given": "Joe"
	}
	,
    "gender": "Male",
    "birthDate": "1952-09-24"
}
```
#### Use the fetch API to return the file contents
In the `patients.js` view-model, we'll need to
- Import the required plugins
- Inject the HttpClient
- Fetch the contents of the json file as an object patientData
```JS
import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class Patient {

    constructor (http) {
        this.http = http;
    }

    activate() {
        return this.http.fetch('patients.json')
        .then(response => response.json())
        .then(patientData => this.patientData = patientData)
    }
}
```
Now to display this object in our view (`patient.html`)
```JS
<table class = table>
        <tr>
            <th>Clinic Id</th>
            <th>Surname</th>
            <th>Given name</th>
            <th>Gender</th>
            <th>Birth Date</th>
        </tr>
        <tr>
            <td>${patientData.id}</td>
            <td>${patientData.name.family}</td>
            <td>${patientData.name.given}</td>
            <td>${patientData.gender}</td>
            <td>${patientData.birthDate}</td>
        </tr>
    </table>
```
####Using the repeat.for loop to display arrays of external data

Update the `patients.json` file to have several patients stored in an array:

```
[
    {"id":"10001",
    "name": {"family":"Bloggs", "given":"Joe"}, 
    "gender": "Male",
    "birthDate": "1952-09-24"},

    {"id":"10002",
    "name": {"family":"Bloggs", "given":"Jim"}, 
    "gender": "Male",
    "birthDate": "1953-10-25"},   

    {"id":"10003",
    "name": {"family":"Bloggs", "given":"Jon"}, 
    "gender": "Male",
    "birthDate": "1954-11-26"}
]
```

To populate the table in our view, we can add a repeat.for loop in the `patient.html` file:

```JS
		<tr repeat.for = "patientRecord of patientData">
            <td>${patientRecord.id}</td>
            <td>${patientRecord.name.family}</td>
            <td>${patientRecord.name.given}</td>
            <td>${patientRecord.gender}</td>
            <td>${patientRecord.birthDate}</td>
        </tr>
```

### Coding the UI
So far we've been making views (html) and view-models (js) for each of our pages.
Let's say that we wanted to make a reusable html element (like a navigation bar).
For this, Aurelia lets us specify view templates without needing an associated view model.

Make a file in the src directory: nav.html and insert the following:
```

```

last updated: 19 Aug 2016