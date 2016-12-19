var Tourist = require('./Tourist');
var Tour = require('./Tour');

var tourist = new Tourist();
var tour = new Tour();

//tourist.addTourist().then(function() {
//   tourist.deleteTourist();
//});
tour.addTour().then(function() {
   tour.deleteTour();
});
