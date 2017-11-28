var program = require('commander');
program
.arguments('<src>')
.action(function(src){
    program.src = src; 
})
.parse(process.argv);


console.log(program.src);
if (typeof program.src === 'undefined'){
    console.error('no source folder location supplied!');
    process.exit(1);
}
else if(program.src === "build"){
        console.log("scanning " + program.src + " to build html");
        scanFolder('doc-root/', function(err, results){
            if (err) throw err;
            console.log(results);
        });
}
else {
    console.log(srcFolder);
}