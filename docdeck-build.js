const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
const marked = require('marked');
const path = require('path');
const program = require('commander');

var srcFilePath;
const basePath = path.join(process.cwd(),'www');

// bring across the commander.js arguments
// <> - required input [] - optional input.
program
.arguments('<src>')
.action(function(src){
    // Record the src file in the global srcFilePath variable.
    srcFilePath = src;
})
.parse(process.argv);


// set marked.js configuration
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

// Print out a single row of the table of contents
function printTableOfContentsRow(rowNum, headerTag, headerValue) {
      console.log(rowNum + ": " + headerTag + " " + headerValue);
}

// Print out the entire table of contents using a custom parser
function makeTOC(convertedData){
  let rowNum = 0;
  // Define the parser used to parse the data
  var parser = new htmlparser.Parser({
      // Define the behaviour of the parser on seeing an open tag
      onopentag: function(tag, attribs){
          if(tag === "h1" || tag === "h2" || tag === "h3"){
              rowNum++;
              printTableOfContentsRow(rowNum,tag,attribs.id);
          }
      }
  });

  console.log("row tag header")
  parser.write(convertedData);
  parser.end();
};

// Given the srcPath,
function makePage(srcPath) {
    var templatePath = path.dirname(require.main.filename);
    var destPath = path.join('www', path.parse(srcPath).dir, path.parse(srcPath).name + '.html');
    srcPath = path.join(srcFilePath, srcPath);
    // create base html file
    fs.createReadStream(path.join(templatePath,'server/base.html')).pipe(fs.createWriteStream(destPath));
    // append converted markdown to file
    fs.readFile(srcPath, function(err, data){
        if (err){ throw err; }
        var convertedData = marked(data.toString()) + "</div></body></html>";
        makeTOC(convertedData);
        fs.appendFile(destPath, convertedData, function(err){
            if (err) throw err;
            console.log("writing... " + destPath);
        });
    });
}

// scan doc-root for file and folders
var scanFolder = function(dir, done) {
    var results = [];

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath);
    }
    fs.readdir(dir, function(err, list){
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            var relFile = path.relative(srcFilePath, file);
            fs.stat(file, function(err, stat){
                // if a folder...
                if (stat && stat.isDirectory()) {
                    console.log("creating directory:" + relFile);
                    fs.mkdirSync(path.join(basePath, relFile));
                    //...recursive call to scanFolder function
                    scanFolder(file, function(err, res) {
                        if (! --pending) done(null, results);
                    });
                }
                else if (path.extname(file) == ".md") {
                  console.log("writing " + relFile);
                    makePage(relFile);
                    console.log("relFile = "+ relFile);
                    if (! --pending) done(null, results);
                }
                else {
                    console.log("--ignored--: " + file);
                    if (! --pending) done(null, results);
                }
            });
        });
    });
};

// run the app
console.log(__dirname);
if (typeof srcFilePath === 'undefined'){
    console.error('no source folder location supplied!');
    process.exit(1);
}
// need to insert a check for folder existing
else {
        console.log("scanning " + srcFilePath + " to build html");
        scanFolder(srcFilePath, function(err, results){
            if (err) throw err;
            console.log(results);
        });
}
