'use strict';

const ONE = 1;

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

    getTourists() {
        return this._tourists;
    }

    getTouristCount() {
        return this._tourists.length;
    }

    deleteTourist(number) {
        this._tourists[number] && (this._tourists.splice(number, ONE));
    }
}

module.exports = Tourists;