'use strict';

var Tour = class {
   constructor(info) {
      this._place = info.place;
      this._showPlace = info.showPlace;
      this._days = info.days;
      this._passage = info.passage;
      this._price = info.price;
      this._touristsCount = info.touristsCount;
   }

   getData() {
      return {
         place: this._place,
         showPlace: this._showPlace,
         days: this._days,
         passage: this._passage,
         showPlace: this._showPlace,
         passage: this._passage,
         price: this._price,
         touristsCount: this._touristsCount
      }
   }
}

module.exports = Tour;