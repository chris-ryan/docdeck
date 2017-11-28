var fs = require('fs');
var htmlparser = require('htmlparser2');
var marked = require('marked');
var path = require('path');
var program = require('commander');

// bring across the commander.js arguments
program
.arguments('<src>')
.action(function(src){
    program.src = src; 
})
.parse(process.argv);

// set marked.js configuration
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

// function definitions
function TableOfContents(rowNum, headerTag, headerValue) { 
    this.rowNum = rowNum;
    this.headerTag = headerTag;
    this.headerValue = headerValue;
    this.printTOC = function() {
        console.log(this.rowNum + ": " + this.headerTag + this.headerValue);
    };
}

function makeTOC(convertedData){
var rowNum = 0;
var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
        if(name === "h1" || name === "h2" || name === "h3"){
            rowNum++;
            console.log(name + ": " + attribs.id);
            var toc1 = new TableOfContents(rowNum,name,attribs.id);
            toc1.printTOC();
        }
    }
});
parser.write(convertedData);
};

function makePage(srcPath) { 
    var templatePath = path.dirname(require.main.filename);
    var destPath = path.join('www', path.parse(srcPath).dir, path.parse(srcPath).name + '.html');
    srcPath = path.join('doc-root', srcPath);
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
    var basePath = path.join(process.cwd(),'www');
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(path.join(process.cwd(),'www'));
    }
    fs.readdir(dir, function(err, list){
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            var relFile = path.relative('./doc-root/', file);
            fs.stat(file, function(err, stat){
                // if a folder...
                if (stat && stat.isDirectory()) {
                    console.log("creating directory:" + relFile);
                    fs.mkdirSync(path.join('www', relFile));
                    //...recursive call to scanFolder function
                    scanFolder(file, function(err, res) {
                        if (! --pending) done(null, results);
                    });
                }
                else if (path.extname(file) == ".md") {
                    makePage(relFile);
                    console.log(relFile);
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
if (typeof program.src === 'undefined'){
    console.error('no source folder location supplied!');
    process.exit(1);
}
// need to insert a check for folder existing
else {
        console.log("scanning " + program.src + " to build html");
        scanFolder(program.src, function(err, results){
            if (err) throw err;
            console.log(results);
        });
}