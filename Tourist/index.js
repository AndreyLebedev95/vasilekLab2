'use strict';

const TOURIST_FIELDS = {
    NAME: 0,
    F_NAME: 1,
    S_NAME: 2,
    PLACE: 3,
    SHOW_PLACE: 4,
    PASSAGE: 5,
    MIN_PRICE: 6,
    MAX_PRICE: 7
}
const ZERO = 0;
const ONE = 1;

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
                case TOURIST_FIELDS.PASSAGE:
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
                case TOURIST_FIELDS.MIN_PRICE:
                case TOURIST_FIELDS.MAX_PRICE:
                    if (line === '') {
                        break;
                    }
                    line = parseInt(line);
                    if (!line || line < ZERO || (result[TOURIST_FIELDS.MIN_PRICE] && result[TOURIST_FIELDS.MIN_PRICE] > line)) {
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
                    firstName: result[TOURIST_FIELDS.NAME].trim(),
                    secondName: result[TOURIST_FIELDS.F_NAME].trim(),
                    thirdName: result[TOURIST_FIELDS.S_NAME].trim(),
                    place: result[TOURIST_FIELDS.PLACE].trim(),
                    showPlace: result[TOURIST_FIELDS.SHOW_PLACE].trim(),
                    passage: result[TOURIST_FIELDS.PASSAGE],
                    minPrice: result[TOURIST_FIELDS.MIN_PRICE],
                    maxPrice: result[TOURIST_FIELDS.MAX_PRICE]
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
            line = parseInt(line.trim()) - ONE;
            if ((!line && line !== ZERO) || line < ZERO || line >= self._tourists.getTouristCount()) {
                console.log('Неверный номер туриста, повторите ввод');
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

    getTouristWithSuggestions() {
        var result = [];

        this._tourists.getTourists().forEach(function(tourist) {
            if (tourist.isHaveSuggestions()) {
                result.push(tourist.getData());
            }
        });
        return result;
    }

    getTouristWithoutSuggestions() {
        var result = [];

        this._tourists.getTourists().forEach(function(tourist) {
            if (!tourist.isHaveSuggestions()) {
                result.push(tourist.getData());
            }
        });
        return result;
    }

    getTouristWithNumber(touristNumber) {
        return this._tourists.getTouristsList()[touristNumber];
    }

    getTourists() {
        return this._tourists.getTouristsList();
    }

    printTouristWithNumber(touristNumber) {
        var tourist = this._tourists.getTouristsList()[touristNumber];

        this.printTourist(tourist);
    }

    printTourist(tourist) {
        console.log('Имя: ' + tourist.firstName);
        console.log('Фамилия: ' + tourist.secondName);
        console.log('Отчество: ' + tourist.thirdName);
        tourist.place && (console.log('Желаемая страна: ' + tourist.place));
        tourist.showPlace && (console.log('Желаемая достопремечательность: ' + tourist.showPlace));
        tourist.passage && (console.log('Желаемый транспорт: ' + tourist.passage));
        tourist.minPrice && (console.log('Минимальный бюджет: ' + tourist.minPrice));
        tourist.maxPrice && (console.log('Максимальный бюджет: ' + tourist.maxPrice));
        console.log('');
    }

    getTouristsWithFNameSort() {
        var tourists = this.getTourists();

        return tourists.sort(function(el1, el2) {
            if (el1.secondName > el2.secondName) {
                return ONE;
            }
            if (el1.secondName < el2.secondName) {
                return -ONE;
            }
            return ZERO;
        });
    }

    printTouristsList() {
        var self = this;

        this._tourists.getTouristsList().forEach(function(tourist, index) {
            console.log('Турист номер: ' + (index + ONE));
            self.printTourist(tourist);
        });
    }
}


module.exports = new TouristsView();