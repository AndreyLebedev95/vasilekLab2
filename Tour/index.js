var
    Tours = require('./Tours'),
    fs = require('fs'),
    readLine = require('readline');

var ToursView = function() {
   this._tours = new Tours();
   this._loadTours();
};

ToursView.prototype._loadTours = function() {
   var self = this;

   fs.exists('./Tour/data.json', function(exists) {
      if (exists) {
         fs.readFile('./Tour/data.json', 'utf8', function (err, data){
            if (err){
               console.log(err);
            } else {
               console.log(data);
               if (data) {
                  self._tours.setTours(JSON.parse(data));
               }
            }});
      } else {

      }
   });
};

ToursView.prototype._saveTours = function() {
   fs.writeFile('./Tour/data.json', JSON.stringify(this._tours.getToursList()));
};

ToursView.prototype.addTour = function() {
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
         case 1:
            line = line.trim().split(/\s*,\s*/);
            if (!line.length) {
               console.log('Некорректный ввод, попробуйте еще раз');
               readInterface.prompt();
               return;
            }
            break;
         case 2:
         case 4:
         case 5:
            line = parseInt(line.trim());
            if (!line || line <=0) {
               console.log('Некорректный ввод, попробуйте еще раз');
               readInterface.prompt();
               return;
            }
            break;
         case 3:
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
            place: result[0],
            showPlace: result[1],
            days: result[2],
            passage: result[3],
            price: result[4],
            touristsCount: result[5]
         });
         self._saveTours();
         globalResolve();
      }
   });

   return finalPromise;
};

ToursView.prototype.askTourNumber = function() {
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
      line = parseInt(line.trim()) - 1;
      if ((!line && line !== 0) || line < 0 || line >= self._tours.getTourCount()) {
         console.log('Не верный номер тура, повторите ввод');
         readInterface.prompt();
         return;
      }
      readInterface.close();
      globalResolve(line);
   });
   readInterface.prompt();

   return finalPromise;
};

ToursView.prototype.deleteTour = function() {
   var
       self = this,
       finalPromise = this.askTourNumber();

   finalPromise.then(function(number) {
      self._tours.deleteTour(number);
      self._saveTours();
   });

   return finalPromise;
};

ToursView.prototype.printToursList = function() {
   this._tours.getToursList().forEach(function(tour, index) {
      console.log('Тур номер: ' + (index + 1));
      console.log('Страна: ' + tour.place);
      console.log('Достопримечательности: ' + tour.showPlace.join(', '));
      console.log('Количество дней: ' + tour.days);
      console.log('Вид транспорта: ' + tour.passage);
      console.log('Цена: ' + tour.price);
      console.log('Количество туристов: ' + tour.touristsCount);
   });
};

module.exports = ToursView;