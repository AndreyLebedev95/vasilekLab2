'use strict';

var
    tourist = require('./Tourist'),
    tour = require('./Tour'),
    menu = require('./MainMenu'),
    compareTouristAndTour = function(tourist, tour) {
       if ((!tourist.place || tourist.place.toLowerCase() === tour.place.toLowerCase()) &&
           (!tourist.passage || tourist.passage === tour.passage) &&
           (!tourist.minPrice || tourist.minPrice < tour.price) &&
           (!tourist.maxPrice || tourist.maxPrice > tour.price)) {
          let showPlaceToLowerCase = tour.showPlace.map((el) => {
             return el.toLowerCase();
          });

          if (!tourist.showPlace ||
              (showPlaceToLowerCase.indexOf(tourist.showPlace.toLowerCase()) + 1)) {
             return true;
          }
       }

       return false;
    },
    afterUserChoice = function(userChoice) {
       var
           finishPromise;

       switch(userChoice)  {
          case 1:
             finishPromise = tourist.addTourist();
             break;
          case 2:
             finishPromise = tourist.deleteTourist();
             break;
          case 3:
             finishPromise = tour.addTour();
             break;
          case 4:
             finishPromise = tour.deleteTour();
             break;
          case 5:
             break;
          case 6:
             finishPromise = tourist.askTouristNumber();

             finishPromise.then(function(touristNumber) {
                let
                    needTourist = tourist.getTouristWithNumber(touristNumber),
                    toursList = tour.getTours(),
                    result, i = 0;

                for (i = 0; i < toursList.length; i++) {
                   if (compareTouristAndTour(needTourist, toursList[i])) {
                      result = i;
                      break;
                   }
                }
                if (result || result === 0) {
                   console.log('Подобранный тур');
                   tour.printTourWithNumber(result);
                } else {
                   console.log('Для выбранного туриста нет подходящего тура');
                }
             });
             break;
          case 7:
             break;
          case 8:
             finishPromise = tour.askTourNumber();

             finishPromise.then(function(number) {
                let
                    needTour = tour.getTourWithNumber(number),
                    touristList = tourist.getTourists(),
                    result = [], i = 0;

                for (i = 0; i < touristList.length; i++) {
                   if (compareTouristAndTour(touristList[i], needTour)) {
                      result.push(i);
                   }
                }
                if (result.length) {
                   for (i = 0; i < result.length; i++) {
                      tourist.printTouristWithNumber(result[i]);
                      console.log('');
                   }
                } else {
                   console.log('Для выбранного тура нет туристов');
                }
             });
             break;
       }

       finishPromise.then(function() {
          menu.askUserChoice(menuItems).then(afterUserChoice);
       });
    },
    menuItems = [
       'Добавить туриста',
       'Удалить туриста',
       'Добавить тур',
       'Удалить тур',
       'Сформировать туристические группы по имеющимся данным',
       'Вывести на экран сведения о подобранном туре для заданного туриста',
       'Вывести на экран туры, отобранные по стране или достопримечательности, или стоимости',
       'Вывод на экран списка туристов, подобранных для заданного тура'
    ];

menu.askUserChoice(menuItems).then(afterUserChoice);