'use strict';

const USER_MENU_CHOICE = {
   ADD_TOURIST: 1,
   DELETE_TOURIST: 2,
   ADD_TOUR: 3,
   DELETE_TOUR: 4,
   FORM_GROUPS: 5,
   PRINT_TOURIST_TOUR: 6,
   PRINT_SORT_TOURS: 7,
   PRINT_TOUR_TOURISTS: 8
};
const ZERO = 0;
const ONE = 1;

var
    tourist = require('./Tourist'),
    tour = require('./Tour'),
    menu = require('./MainMenu'),
    tourGroup = require('./TourGroup'),
    compareTouristAndTour = function(tourist, tour) {
       if ((!tourist.place || tourist.place.toLowerCase() === tour.place.toLowerCase()) &&
           (!tourist.passage || tourist.passage === tour.passage) &&
           (!tourist.minPrice || tourist.minPrice < tour.price) &&
           (!tourist.maxPrice || tourist.maxPrice > tour.price)) {
          let showPlaceToLowerCase = tour.showPlace.map((el) => {
             return el.toLowerCase();
          });

          if (!tourist.showPlace ||
              (showPlaceToLowerCase.indexOf(tourist.showPlace.toLowerCase()) + ONE)) {
             return true;
          }
       }

       return false;
    },
    afterUserChoice = function(userChoice) {
       var
           finishPromise;

       switch(userChoice)  {
          case USER_MENU_CHOICE.ADD_TOURIST:
             finishPromise = tourist.addTourist();
             break;
          case USER_MENU_CHOICE.DELETE_TOURIST:
             finishPromise = tourist.deleteTourist();
             break;
          case USER_MENU_CHOICE.ADD_TOUR:
             finishPromise = tour.addTour();
             break;
          case USER_MENU_CHOICE.DELETE_TOUR:
             finishPromise = tour.deleteTour();
             break;
          case USER_MENU_CHOICE.FORM_GROUPS:
             finishPromise = new Promise(function(resolve) {
                tourGroup.printTouristGroup();
                resolve();
             });
             break;
          case USER_MENU_CHOICE.PRINT_TOURIST_TOUR:
             finishPromise = tourist.askTouristNumber();

             finishPromise.then(function(touristNumber) {
                let
                    needTourist = tourist.getTouristWithNumber(touristNumber),
                    toursList = tour.getTours(),
                    result, i = 0;

                for (i = ZERO; i < toursList.length; i++) {
                   if (compareTouristAndTour(needTourist, toursList[i])) {
                      result = i;
                      break;
                   }
                }
                if (result || result === ZERO) {
                   console.log('Подобранный тур');
                   tour.printTourWithNumber(result);
                } else {
                   console.log('Для выбранного туриста нет подходящего тура');
                }
             });
             break;
          case USER_MENU_CHOICE.PRINT_SORT_TOURS: {
              let
                  sort = [
                      'По стране',
                      'По достопримечательности',
                      'По цене'
                  ],
                  userChoicePromise,
                  userInputPromise,
                  globalResolve;

              finishPromise = new Promise(function (resolve) {
                  globalResolve = resolve;
              })
              console.log('Выберите по чему хотите сортировать')
              userChoicePromise = menu.askUserChoice(sort);
              userChoicePromise.then(function (number) {
                  const SORT_CHOICE = {
                      COUNTRY: 1,
                      SHOW_PLACE: 2,
                      PRICE: 3
                  }

                  switch (number) {
                      case SORT_CHOICE.COUNTRY:
                          userInputPromise = menu.readString('Введите название страны');
                          userInputPromise.then(function (country) {
                              tour.printSortCountryTour(country);
                          });
                          break;
                      case SORT_CHOICE.SHOW_PLACE:
                          userInputPromise = menu.readString('Введите достопримечательность');
                          userInputPromise.then(function (showPlace) {
                              tour.printSortShowPlaceTour(showPlace);
                          });
                          break;
                      case SORT_CHOICE.PRICE:
                          userInputPromise = menu.readNumber('Введите цену');
                          userInputPromise.then(function (price) {
                              tour.printSortPriceTour(price);
                          });
                          break;
                  }

                  userInputPromise.then(function () {
                      globalResolve();
                  })
              });
              break;
          }
          case USER_MENU_CHOICE.PRINT_TOUR_TOURISTS:
             finishPromise = tour.askTourNumber();

             finishPromise.then(function(number) {
                let
                    needTour = tour.getTourWithNumber(number),
                    touristList = tourist.getTouristsWithFNameSort(),
                    result = [], i = 0;

                for (i = ZERO; i < touristList.length; i++) {
                   if (compareTouristAndTour(touristList[i], needTour)) {
                      result.push(touristList[i]);
                   }
                }
                if (result.length) {
                   for (i = ZERO; i < result.length; i++) {
                      tourist.printTourist(result[i]);
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