"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WeakReadonlyArray {
    constructor(lengthOrStartOfItems, ...items) {
        if (typeof lengthOrStartOfItems === 'number') {
            this._array = new Array(lengthOrStartOfItems);
        }
        else {
            this._array = [lengthOrStartOfItems, ...items];
        }
        for (let i = 0; i < this._array.length; i++) {
            const iInIteration = i;
            if (iInIteration in this._array) { // must consider case that the index is empty
                Object.defineProperty(this, iInIteration, {
                    get: () => {
                        return this._array[iInIteration];
                    },
                });
            }
        }
    }
    [Symbol.iterator]() {
        return this._array[Symbol.iterator]();
    }
    get length() {
        return this._array.length;
    }
}
exports.default = WeakReadonlyArray;
