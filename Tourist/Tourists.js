var Tourist = require('./Tourist');

var Tourists = function() {
    this._tourists = [];
};

Tourists.prototype.setTourists = function(tourists) {
    for (var i = 0; i < tourists.length; i++) {
        this.addTourist(tourists[i]);
    }
};

Tourists.prototype.addTourist = function(touristInfo) {
    this._tourists.push(new Tourist(touristInfo));
};

Tourists.prototype.getTouristsList = function() {
    return this._tourists.map(function(tourist) {
        return tourist.getData();
    });
};

Tourists.prototype.getTouristCount = function() {
   return this._tourists.length;
};

Tourists.prototype.deleteTourist = function(number) {
    this._tourists[number] && (this._tourists.splice(number, 1));
};

module.exports = Tourists;