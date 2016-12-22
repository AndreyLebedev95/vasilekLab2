'use strict';

const ZERO = 0;
const ONE = 1

var
    readLine = require('readline'),
    showMenu = function(menuItems) {
       for (var i = 0; i < menuItems.length; i++) {
          console.log((i + ONE)+ ' ' + menuItems[i]);
       }
    },
    askUserChoice = function(menuItems) {
       var
           globalResolve,
           readInterface = readLine.createInterface({
              input: process.stdin,
              output: process.stdout
           }),
           final = new Promise(function(resolve) {
              globalResolve = resolve;
           });

       showMenu(menuItems);
       console.log('Выберите и введите номер желаемого действия');
       readInterface.on('line', function(line) {
          line = parseInt(line);
          if (!line || line > menuItems.length || line < ZERO) {
             console.log('Некорректный ввод, выберите номер');
             readInterface.prompt();
             return;
          }
          globalResolve(line);
          readInterface.close();
       });
       readInterface.prompt();

       return final;
    },
    readString = function(question) {
        var
            globalResolve,
            finalPromise = new Promise(function(resolve){
                globalResolve = resolve;
            }),
            readInterface = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            });

        readInterface.question(question + '\n', function(answer){
            readInterface.close();
            globalResolve(answer);
        });
        return finalPromise;
    },
    readNuber = function(question) {
        var
            globalResolve,
            finalPromise = new Promise(function(resolve){
                globalResolve = resolve;
            }),
            readInterface = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            });

        console.log(question + '\n');
        readInterface.on('line', function(line) {
            line = parseInt(line);
            if (!line && line !== ZERO) {
                console.log('Введите число');
                readInterface.prompt();
                return;
            }
            readInterface.close();
            globalResolve(line);
        });
        readInterface.prompt();
        return finalPromise;
    }


module.exports = {
   askUserChoice: askUserChoice,
   readString: readString,
   readNumber: readNuber
};