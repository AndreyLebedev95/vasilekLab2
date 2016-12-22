'use strict';

var
    Tourists = require('./Tourists'),
    fs = require('fs'),
    readLine = require('readline');

var TouristsView = class {

    constructor() {
        this._tourists = new Tourists();
        this._loadTourists();
    }

    _loadTourists() {
        var self = this;

        fs.exists('./Tourist/data.json', function(exists) {
            if (exists) {
                fs.readFile('./Tourist/data.json', 'utf8', function (err, data){
                    if (err){
                        console.log(err);
                    } else {
                        if (data) {
                            self._tourists.setTourists(JSON.parse(data));
                        }
                    }});
            }
        });
    }

    _saveTourists() {
        fs.writeFile('./Tourist/data.json', JSON.stringify(this._tourists.getTouristsList()));
    }

    addTourist() {
        var
            globalResolve,
            readInterface = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            }),
            questions = [
                'Введите имя туриста \n',
                'Введите фамилию туриста \n',
                'Введите отчество туриста \n',
                'Введите страну или город куда хочет турист, если такого пожелания нет, просто намите enter \n',
                'Введите что хочет посмотреть турист, если такого пожелания нет, просто намите enter \n',
                'Введите чем хочет турист добраться до места \n (автобус, поезд, самолет, теплоход), если такого пожелания нет, просто намите enter \n',
                'Введите минимальную желательную стоимость, если такого пожелания нет, просто намите enter \n',
                'Введите максимальную желательную стоимость, если такого пожелания, просто намите enter \n'
            ],
            self = this,
            result = [],
            i = 0,
            finalPromise = new Promise(function(resolve) {
                globalResolve = resolve;
            });

        console.log(questions[i]);
        readInterface.prompt();
        readInterface.on('line', function(line) {
            switch (i) {
                case 5:
                    line = line.toLocaleLowerCase().trim();
                    if (line === '') {
                        break;
                    }
                    if (line !== 'автобус' && line !== 'поезд' && line !== 'теплоход' && line !== 'самолет') {
                        console.log('Такого транспорта нет, выберете другой');
                        readInterface.prompt();
                        return;
                    }
                    break;
                case 6:
                case 7:
                    if (line === '') {
                        break;
                    }
                    line = parseInt(line);
                    if (!line || line < 0 || (result[6] && result[6] > line)) {
                        console.log('Не допустимое значение цены, введите корректную цену');
                        readInterface.prompt();
                        return;
                    }
                    break;
            }
            result.push(line);
            i++;
            if (i < questions.length) {
                console.log(questions[i]);
                readInterface.prompt();
            } else {
                readInterface.close();
                self._tourists.addTourist({
                    firstName: result[0],
                    secondName: result[1],
                    thirdName: result[2],
                    place: result[3],
                    showPlace: result[4],
                    passage: result[5],
                    minPrice: result[6],
                    maxPrice: result[7]
                });
                self._saveTourists();
                globalResolve();
            }
        });

        return finalPromise;
    }

    askTouristNumber() {
        var
            self = this,
            globalResolve,
            readInterface = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            }),
            finalPromise = new Promise(function(resolve) {
                globalResolve = resolve;
            });

        this.printTouristsList();
        console.log('Введите номер туриста');

        readInterface.on('line', function(line) {
            line = parseInt(line.trim()) - 1;
            if ((!line && line !== 0) || line < 0 || line >= self._tourists.getTouristCount()) {
                console.log('Не верный номер туриста, повторите ввод');
                readInterface.prompt();
                return;
            }
            readInterface.close();
            globalResolve(line);
        });
        readInterface.prompt();

        return finalPromise;
    }

    deleteTourist() {
        var
            self = this,
            finalPromise = this.askTouristNumber();

        finalPromise.then(function(number) {
            self._tourists.deleteTourist(number);
            self._saveTourists();
        });

        return finalPromise;
    }

    getTouristWithNumber(touristNumber) {
        return this._tourists.getTouristsList()[touristNumber];
    }

    getTourists() {
        return this._tourists.getTouristsList();
    }

    printTouristWithNumber(touristNumber) {
        var tourist = this._tourists.getTouristsList()[touristNumber];

        console.log('Имя: ' + tourist.firstName);
        console.log('Фамилия: ' + tourist.secondName);
        console.log('Отчество: ' + tourist.thirdName);
        tourist.place && (console.log('Желаемая страна: ' + tourist.place));
        tourist.showPlace && (console.log('Желаемая достопремечательность: ' + tourist.showPlace));
        tourist.passage && (console.log('Желаемый транспорт: ' + tourist.passage));
        tourist.minPrice && (console.log('Минимальный бюджет: ' + tourist.minPrice));
        tourist.maxPrice && (console.log('Максимальный бюджет: ' + tourist.maxPrice));
    }

    printTouristsList() {
        this._tourists.getTouristsList().forEach(function(tourist, index) {
            console.log('Турист номер: ' + (index + 1));
            console.log('Имя: ' + tourist.firstName);
            console.log('Фамилия: ' + tourist.secondName);
            console.log('Отчество: ' + tourist.thirdName);
            tourist.place && (console.log('Желаемая страна: ' + tourist.place));
            tourist.showPlace && (console.log('Желаемая достопремечательность: ' + tourist.showPlace));
            tourist.passage && (console.log('Желаемый транспорт: ' + tourist.passage));
            tourist.minPrice && (console.log('Минимальный бюджет: ' + tourist.minPrice));
            tourist.maxPrice && (console.log('Максимальный бюджет: ' + tourist.maxPrice));
        });
    }
}


module.exports = new TouristsView();