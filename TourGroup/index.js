'use strict';

const ONE = 1;
const ZERO = 0;

var
    tourist = require('../Tourist'),
    tour = require('../Tour');

var TourGroup = class {
    constructor() {}

    printTouristGroup() {

        var
            tours = tour.getTours(),
            touristWithSuggestions = tourist.getTouristWithSuggestions(),
            touristWithoutSuggestions = tourist.getTouristWithoutSuggestions(),
            i = 0, j = 0;

        for (i = ZERO; i < tours.length; i++) {
            tours[i].tourists = [];
            for (j = ZERO; j < touristWithSuggestions.length; j++) {
                if (this.compareTouristAndTour(touristWithSuggestions[j],tours[i])) {
                    tours[i].tourists.push(touristWithSuggestions[j]);
                    touristWithSuggestions.splice(j, ONE);
                    j--;
                    if (tours[i].tourists.length === tours[i].touristsCount) {
                        break;
                    }
                }
            }
        }
        for (i = ZERO; i < tours.length; i++) {
            if (tours[i].tourists.length === tours[i].touristsCount) {
                continue;
            }
            for (j = ZERO; j < touristWithoutSuggestions.length; j++) {
                if (this.compareTouristAndTour(touristWithoutSuggestions[j],tours[i])) {
                    tours[i].tourists.push(touristWithoutSuggestions[j]);
                    touristWithoutSuggestions.splice(j,ONE);
                    j--;
                    if (tours[i].tourists.length === tours[i].touristsCount) {
                        break;
                    }
                }
            }
        }

        j = ONE;
        for (i = ZERO; i < tours.length; i++) {
            if (tours[i].tourists.length) {
                console.log('Группа ' + (j++));
                tour.printTour(tours[i]);
                console.log('Туристы группы');
                tours[i].tourists.forEach(function(tourTourist) {
                    tourist.printTourist(tourTourist);
                });
            }
        }
    }

    compareTouristAndTour(tourist, tour) {
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
    }
}

module.exports = new TourGroup();