'use strict';

const ZERO = 0;

var Tourist = class {

    constructor(info) {
        this._firstName = info.firstName;
        this._secondName = info.secondName;
        this._thirdName = info.thirdName;
        this._place = info.place || '';
        this._showPlace = info.showPlace || '';
        this._passage = info.passage || '';
        this._minPrice = info.minPrice;
        this._maxPrice = info.maxPrice;
    }

    getData() {
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
    }

    isHaveSuggestions() {
        return !!(this._place || this._showPlace || this._passage || this._minPrice || this._maxPrice ||
            this._maxPrice === ZERO || this._minPrice === ZERO);
    }
}

module.exports = Tourist;