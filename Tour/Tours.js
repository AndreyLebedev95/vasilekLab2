'use strict';

var Tour = require('./Tour');

var Tours = class {

   constructor() {
      this._tours = [];
   }

   setTours(tours) {
      for (var i = 0; i < tours.length; i++) {
         this.addTour(tours[i]);
      }
   }

   addTour(tourInfo) {
      this._tours.push(new Tour(tourInfo));
   }

   getToursList() {
      return this._tours.map(function(tour) {
         return tour.getData();
      });
   }

   getTourCount() {
      return this._tours.length;
   }

   deleteTour(number) {
      this._tours[number] && (this._tours.splice(number, 1));
   }
}

module.exports = Tours;