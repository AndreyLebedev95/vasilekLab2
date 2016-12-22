'use strict';

const TOUR_FIELDS = {
   PLACE: 0,
   SHOW_PLACE: 1,
   DAYS: 2,
   PASSAGE: 3,
   PRICE: 4,
   TOURIST_COUNT: 5
};
const ZERO = 0;
const ONE = 1;

var
    Tours = require('./Tours'),
    fs = require('fs'),
    readLine = require('readline');

var ToursView = class {

   constructor() {
      this._tours = new Tours();
      this._loadTours();
   }

   _loadTours() {
      var self = this;

      fs.exists('./Tour/data.json', function(exists) {
         if (exists) {
            fs.readFile('./Tour/data.json', 'utf8', function (err, data){
               if (err){
                  console.log(err);
               } else {
                  if (data) {
                     self._tours.setTours(JSON.parse(data));
                  }
               }});
         }
      });
   }

   _saveTours() {
      fs.writeFile('./Tour/data.json', JSON.stringify(this._tours.getToursList()));
   }

   printSortCountryTour(country) {
      var
          self = this,
          isTourFind = false;

      country = country.trim();
      this._tours.getToursList().forEach(function(tour, index) {
         if (tour.place.toLowerCase() === country.toLowerCase()) {
            self.printTourWithNumber(index);
            console.log('');
            isTourFind = true;
         }
      });
      if (!isTourFind) {
         console.log('Туров не найдено');
      }
   }

   printSortShowPlaceTour(showPlace) {
      var
          self = this,
          isTourFind = false;

      showPlace = showPlace.trim();
      this._tours.getToursList().forEach(function(tour, index) {
         let
             tourShowPlaceToLowerCase = tour.showPlace.map(function(place) {
                return place.toLowerCase();
             });

         if (tourShowPlaceToLowerCase.indexOf(showPlace.toLowerCase()) + ONE) {
             self.printTourWithNumber(index);
             console.log('');
             isTourFind = true;
         }
      });
      if (!isTourFind) {
         console.log('Туров не найдено');
      }
   }

   printSortPriceTour(price) {
      var
          self = this,
          isTourFind = false;

      this._tours.getToursList().forEach(function(tour, index) {
         if (tour.price === price) {
            self.printTourWithNumber(index);
            console.log('');
            isTourFind = true;
         }
      });
      if (!isTourFind) {
         console.log('Туров не найдено');
      }
   }

   addTour() {
      var
          globalResolve,
          readInterface = readLine.createInterface({
             input: process.stdin,
             output: process.stdout
          }),
          questions = [
             'Введите название страны или города тура \n',
             'Введите достопримечательности тура через запятую \n',
             'Введите колличество дней тура \n',
             'Введите вид проезда \n(автобус, поезд, самолет, теплоход)\n',
             'Введите стоимость тура\n',
             'Введите количетсво туристов\n'
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
            case TOUR_FIELDS.SHOW_PLACE:
               line = line.trim().split(/\s*,\s*/);
               if (!line.length) {
                  console.log('Некорректный ввод, попробуйте еще раз');
                  readInterface.prompt();
                  return;
               }
               break;
            case TOUR_FIELDS.DAYS:
            case TOUR_FIELDS.PRICE:
            case TOUR_FIELDS.TOURIST_COUNT:
               line = parseInt(line.trim());
               if (!line || line <= ZERO) {
                  console.log('Некорректный ввод, попробуйте еще раз');
                  readInterface.prompt();
                  return;
               }
               break;
            case TOUR_FIELDS.PASSAGE:
               line = line.toLocaleLowerCase().trim();
               if (line !== 'автобус' && line !== 'поезд' && line !== 'теплоход' && line !== 'самолет') {
                  console.log('Такого транспорта нет, выберете другой');
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
            self._tours.addTour({
               place: result[TOUR_FIELDS.PLACE].trim(),
               showPlace: result[TOUR_FIELDS.SHOW_PLACE],
               days: result[TOUR_FIELDS.DAYS],
               passage: result[TOUR_FIELDS.PASSAGE],
               price: result[TOUR_FIELDS.PRICE],
               touristsCount: result[TOUR_FIELDS.TOURIST_COUNT]
            });
            self._saveTours();
            globalResolve();
         }
      });

      return finalPromise;
   }

   askTourNumber() {
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

      this.printToursList();
      console.log('Введите номер тура');

      readInterface.on('line', function(line) {
         line = parseInt(line.trim()) - ONE;
         if ((!line && line !== ZERO) || line < ZERO || line >= self._tours.getTourCount()) {
            console.log('Неверный номер тура, повторите ввод');
            readInterface.prompt();
            return;
         }
         readInterface.close();
         globalResolve(line);
      });
      readInterface.prompt();

      return finalPromise;
   }

   printTourWithNumber(tourNumber) {
      var tour = this._tours.getToursList()[tourNumber];

      this.printTour(tour);
   }

   getTours() {
      return this._tours.getToursList();
   }

   getTourWithNumber(tourNumber) {
      return this._tours.getToursList()[tourNumber];
   }

   deleteTour() {
      var
          self = this,
          finalPromise = this.askTourNumber();

      finalPromise.then(function(number) {
         self._tours.deleteTour(number);
         self._saveTours();
      });

      return finalPromise;
   }

   printTour(tour) {
       console.log('Страна: ' + tour.place);
       console.log('Достопримечательности: ' + tour.showPlace.join(', '));
       console.log('Количество дней: ' + tour.days);
       console.log('Вид транспорта: ' + tour.passage);
       console.log('Цена: ' + tour.price);
       console.log('Количество туристов: ' + tour.touristsCount);
       console.log('');
   }

   printToursList() {
      var self = this;

      this._tours.getToursList().forEach(function(tour, index) {
         console.log('Тур номер: ' + (index + ONE));
         self.printTour(tour);
      });
   }
}

module.exports = new ToursView();