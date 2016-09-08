var fs = require('fs');
var marked = require('marked');
var path = require('path');

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

function makePage(srcPath) { 
    var destPath = path.join('www', path.parse(srcPath).dir, path.parse(srcPath).name + '.html');
    srcPath = path.join('doc-root', srcPath);
    // create base html file
    fs.createReadStream('server/base.html').pipe(fs.createWriteStream(destPath));
    // append converted markdown to file
    fs.readFile(srcPath, function(err, data){
        if (err){ throw err; }
        var convertedData = marked(data.toString()) + "</div></body></html>";
        fs.appendFile(destPath, convertedData, function(err){
            if (err) throw err;
            console.log("writing... " + destPath);
        });
    });
}

// scan doc-root for file and folders
var scanFolder = function(dir, done) {
    var results = [];
    console.log("scanning ...");
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

scanFolder('doc-root/', function(err, results){
    if (err) throw err;
    console.log(results);
});