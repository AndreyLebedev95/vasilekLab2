var
    readLine = require('readline'),
    showMenu = function(menuItems) {
       for (var i = 0; i < menuItems.length; i++) {
          console.log((i + 1)+ ' ' + menuItems[i]);
       }
    },
    askUserChoice = function(menuItems) {
       var
           globalResolve,
           readInterface = readLine.createInterface({
              input: process.stdin,
              output: process.stdout
           }),
           final = new Promise(function(resolve, reject) {
              globalResolve = resolve;
           });

       showMenu(menuItems);
       console.log('Выберите и введите номер желаемого действия');
       readInterface.on('line', function(line) {
          line = parseInt(line);
          if (!line || line > menuItems.length || line < 0) {
             console.log('Некорректный ввод, выберите номер');
             readInterface.prompt();
             return;
          }
          globalResolve(line);
          readInterface.close();
       });
       readInterface.prompt();

       return final;
    };


module.exports = {
   askUserChoice: askUserChoice
};