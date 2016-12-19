var Tourist = function(info) {
    this._firstName = info.firstName;
    this._secondName = info.secondName;
    this._thirdName = info.thirdName;
    this._place = info.place || '';
    this._showPlace = info.showPlace || '';
    this._passage = info.passage || '';
    this._minPrice = info.minPrice;
    this._maxPrice = info.maxPrice;
};

Tourist.prototype.getData = function() {
    return {
        firstName: this._firstName,
        secondName: this._secondName,
        thirdName: this._thirdName,
        place: this._place,
        showPlace: this._showPlace,
        passage: this._passage,
        minPrice: this._minPrice,
        maxPrice: this._maxPrice
    }
};

module.exports = Tourist;