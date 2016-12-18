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

module.exports = Tourists;