# Getting started with CSS

In the same way we separate out our 'view code' and 'model code' in Aurelia using .html and .js files, style sheets are used to separate out style and layout code from information code on web pages.
By 'style and layout' code, I'm referring to things that alter the appearance of html elements on a web page'.
For example: font, color, size and spacing of text. Borders and backgrounds of tables etc.

The big advantage of this, for a website of many html pages, we only need to code a single stylesheet to give each page a similar look and feel.

Let's take a look at some of the standard 'elements' on and html page. 
Open index.html in the knowledgebase project.

Within the body you'll notice elements such as:
```<h1>``` and ```<h2>``` - the heading elements
```<li>``` - the list elements
```<a>``` - a link element

The syntax of a css file is pretty straightforward. It's basically the name of the element you wish to style, then the properties and parameters you wish to set for that element inside some curly brackets { }
For example, to make the top-level heading blue:

```
h1 { color: blue; }
```

> As an exercise: paste the above into a new file, call it style.css and save it into the same folder as index.html

### Linking a style sheet to a web page
To apply a style sheet to an html page, we have to add a reference to it, within the ```<head>``` section of the html code.
Open index.html and add the following line anywhere between the ```<head> ... </head>``` tags.
```html
 <link rel="stylesheet" href="style.css">
 ```

 Now save the file and view it in your browser.

 The ```<body>``` of an html page is an element that simply refers to the entire page. Any CSS we apply to the body, will apply by default to anything on the page, unless we override it with style code for a child element.
In you style.css file add the line:
```
body { color: yellow; }
```
Save and reload your index.html file. You'll notice that although most of the text is now yellow, the text of the child-element (h1) is still blue.

For a reference of the different style properties and their parameters, check out:
[w3schools](http://www.w3schools.com/cssref/)

Take a look and figure out how to change the backround color of the ```<body>``` element.

last updated: 18 Aug 2016