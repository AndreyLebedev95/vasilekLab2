var Tour = require('./Tour');

var Tours = function() {
   this._tours = [];
};

Tours.prototype.setTours = function(tours) {
   for (var i = 0; i < tours.length; i++) {
      this.addTour(tours[i]);
   }
};

Tours.prototype.addTour = function(tourInfo) {
   this._tours.push(new Tour(tourInfo));
};

Tours.prototype.getToursList = function() {
   return this._tours.map(function(tour) {
      return tour.getData();
   });
};

Tours.prototype.getTourCount = function() {
   return this._tours.length;
};

Tours.prototype.deleteTour = function(number) {
   this._tours[number] && (this._tours.splice(number, 1));
};

module.exports = Tours;