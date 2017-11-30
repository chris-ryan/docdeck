const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
// marked provides a function that parses html and converts it into markdown
const marked = require('marked');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');

// We name the destination folder here (relative to current directory)
const destDirName = 'www';
const htmlExt = '.html';
const markdownExt = '.md';

// Define the name of the directory used as the source
var srcDirName;
// Record the current file directory of where the program is being run from
const currDir = process.cwd();
// Record the base directory (location of docdeck-build.js)
const baseDir = path.dirname(require.main.filename);
// Record the path using the current working directory
const destDir = path.join(currDir, destDirName);


// Delete and recreate the folder
// Prompt the user if and only if the folder already exists
if (fs.existsSync(destDir)) {
    const questions = {
        message: "Warning: you are about to delete and replace the " + destDirName + " folder.\n"+
                          "are you sure you want to continue?",
        type:"confirm",
        name:"continue"
    };
    inquirer.prompt(questions).then(function(response){
        if(response.continue){
            fs.removeSync(destDir);
            fs.mkdirSync(destDir);
            // Run the rest of the program
            exec();
        }
    });
}else{
    fs.mkdirSync(destDir);
    // Run the rest of the program
    exec();
}


// run the program
function exec(){
    // bring across the commander.js arguments
    // <> - required input [] - optional input.
    program
        .arguments('<src>')
        .action(function(src){
            // Record the src file in the global srcDirName variable.
            srcDirName = src;
        })
        .parse(process.argv);

    // Check if src is a directory
    if(srcDirName){
        fs.stat(srcDirName, function(err, stat){
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

    if (typeof srcDirName === 'undefined'){
        console.error('no source folder location supplied!');
        process.exit(1);
    }
    // need to insert a check for folder existing
    else {
        console.log("scanning " + srcDirName + " to build html");
        scanFolder(srcDirName, function(err, results){
            if (err) throw err;
            console.log(results);
        });
        // Copy the css files
        fs.copy(path.join(baseDir,'server/init'), destDirName, (err)=> {
            if(err){
                console.log(err);
            }
        });
    }
}


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

    console.log("row tag header");
    parser.write(htmlData);
    parser.end();
}


// Given the relative path of the destination and the baseDirectory, make a page out of the data
// Note, we assume that this file is of type .md and the data is to be stored in destDirName
function makePage(relPath) {

    // Record the file path of the file we wish to output to
    // This outputs the data to the destDirName folder

    // The data in the destDirName folder mirrors the data in the target folder, but
    // contains html files instead of md files.
    const destPath = path.join(destDirName, path.parse(relPath).dir,
        path.parse(relPath).name + htmlExt);
    // copy the data in the server/base.html file into the destination folder
    // Record the complete path to the current file.
    const srcPath = path.join(srcDirName, relPath);
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
            // Convert a series of files into an absolute path
            file = path.resolve(folderToScan, file);
            var relFile = path.relative(srcDirName, file);
            fs.stat(file, function(err, stat){
                // If it is a folder, recurse on the directory
                if (stat && stat.isDirectory()) {
                    console.log("creating directory:" + relFile);
                    fs.mkdirSync(path.join(destDir, relFile));
                    //...recursive call to scanFolder function
                    scanFolder(file, function(err) {
                        if(err){
                            console.error(err);
                        }
                        if (dirList.length === index+1) done();
                    });
                }
                else if (path.extname(file) === markdownExt) {
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
}
