var readLine = require('readline');

var ReadHelper = function() {

}

ReadHelper.prototype.readFewuestions = function(questions) {
    var
        i = 0,
        result = [],
        readInterface = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    console.log(questions[i]);
    readInterface.prompt();
    readInterface.on('line', function(line) {
        result.push()
    });

};

module.exports = new ReadHelper();