'use strict';

var Tourist = require('./Tourist');

var Tourists = class {
    constructor() {
        this._tourists = [];
    }

    setTourists(tourists) {
        for (var i = 0; i < tourists.length; i++) {
            this.addTourist(tourists[i]);
        }
    }

    addTourist(touristInfo) {
        this._tourists.push(new Tourist(touristInfo));
    }

    getTouristsList() {
        return this._tourists.map(function(tourist) {
            return tourist.getData();
        });
    }

    getTouristCount() {
        return this._tourists.length;
    }

    deleteTourist(number) {
        this._tourists[number] && (this._tourists.splice(number, 1));
    }
}

module.exports = Tourists;