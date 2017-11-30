const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
// marked provides a function that parses html and converts it into markdown.
const marked = require('marked');
const path = require('path');
const program = require('commander');

const htmlFolder = 'www';
const htmlExt = '.html';

var srcFolderPath;
// Record the current file directory of where the program is being run from
const currDir = process.cwd(); // === process.cwd()
// Record the base directory
const baseDir = path.dirname(require.main.filename);
// Record the path using the current working directory
const basePath = path.join(currDir, htmlFolder);

// Delete and recreate the folder
if (fs.existsSync(basePath)) {
  fs.removeSync(basePath);
}
fs.mkdirSync(basePath);

// bring across the commander.js arguments
// <> - required input [] - optional input.
program
.arguments('<src>')
.action(function(src){
    // Record the src file in the global srcFolderPath variable.
    srcFolderPath = src;
})
.parse(process.argv);

// Check if src is a directory
if(srcFolderPath){
fs.stat(srcFolderPath, function(err, stat){
  // Check if it is a folder
  if (!stat || !stat.isDirectory()) {
    console.error("not a valid directory");
  }
});
}

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
function makeTOC(htmlData){

  // Use  parser to print out the table of contents
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
  parser.write(htmlData);
  parser.end();
};

// Given the relative path of the destination and the baseDirectory, make a page out of the data
// Note, we assume that this file is of type .md and the data is to be stored in www
function makePage(relPath) {

    // Record the file path of the file we wish to output to
    // This outputs the data to the www folder

    // The data in the www folder mirrors the data in the target folder, but
    // contains html files instead of md files.
    const destPath = path.join('www', path.parse(relPath).dir, path.parse(relPath).name + '.html');
    // copy the data in the server/base.html file into the destination folder
    // Record the complete path to the current file.
    const srcPath = path.join(srcFolderPath, relPath);
    fs.createReadStream(path.join(baseDir,'server/base.html'))
      .pipe(fs.createWriteStream(destPath));

    // data is the contents of the file found at srcPath
    fs.readFile(srcPath, function(err, data){
        if (err){
          throw err;
        }
        // Append the closing tags that correspond to the open tags
        // found in server/base.html
        const closingTags = "</div></body></html>";
        // The markdown file converted into the html file
        let convertedData = marked(data.toString());
        makeTOC(convertedData);
        // Append the data to the file found at the destination path
        fs.appendFile(destPath, convertedData + closingTags, function(err){
            if (err) {
              throw err;
            }
            console.log("writing to the destination file: " + destPath);
        });
    });
}


// scan a given directory for file and folders
// New dir refers to the new file location that needs to be created
function scanFolder(folderToScan, done) {
  // read and convert directory
  // Function returns a list of items in the current directory
  fs.readdir(folderToScan, function(err, dirList){
    if (err) return done(err);
    // Handle each file one by one
    dirList.forEach(function(file, index){
      file = path.resolve(folderToScan, file);
      var relFile = path.relative(srcFolderPath, file);
      fs.stat(file, function(err, stat){
        // If it is a folder, recurse on the directory
        if (stat && stat.isDirectory()) {
            console.log("creating directory:" + relFile);
            fs.mkdirSync(path.join(basePath, relFile));
            //...recursive call to scanFolder function
            scanFolder(file, function(err, res) {
                if (dirList.length === index+1) done();
            });
        }
        else if (path.extname(file) == ".md") {
            console.log("writing " + relFile);
            makePage(relFile, currDir);
            if (dirList.length === index+1) done();
        }
        else {
            console.log("--ignored--: " + file);
            if (dirList.length === index+1) done();
        }
      });
    });
  });
};
// run the program
if (typeof srcFolderPath === 'undefined'){
    console.error('no source folder location supplied!');
    process.exit(1);
}
// need to insert a check for folder existing
else {
    console.log("scanning " + srcFolderPath + " to build html");
    scanFolder(srcFolderPath, function(err, results){
        if (err) throw err;
        console.log(results);
    });
    // Copy the css files
    fs.copy(path.join(baseDir,'server/init'), htmlFolder, (err)=> {
      if(err){
        console.log(err);
      }
    });
}
