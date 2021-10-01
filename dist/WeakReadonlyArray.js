"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WeakReadonlyArray_array;
Object.defineProperty(exports, "__esModule", { value: true });
class WeakReadonlyArray {
    constructor(lengthOrStartOfItems, ...items) {
        _WeakReadonlyArray_array.set(this, void 0);
        if (typeof lengthOrStartOfItems === 'number') {
            __classPrivateFieldSet(this, _WeakReadonlyArray_array, new Array(lengthOrStartOfItems), "f");
        }
        else {
            __classPrivateFieldSet(this, _WeakReadonlyArray_array, [lengthOrStartOfItems, ...items], "f");
        }
        for (let i = 0; i < __classPrivateFieldGet(this, _WeakReadonlyArray_array, "f").length; i++) {
            const iInIteration = i;
            if (iInIteration in __classPrivateFieldGet(this, _WeakReadonlyArray_array, "f")) { // must consider case that the index is empty
                Object.defineProperty(this, iInIteration, {
                    get: () => {
                        return __classPrivateFieldGet(this, _WeakReadonlyArray_array, "f")[iInIteration];
                    },
                    writable: false,
                });
            }
        }
    }
    [(_WeakReadonlyArray_array = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _WeakReadonlyArray_array, "f")[Symbol.iterator]();
    }
    get length() {
        return __classPrivateFieldGet(this, _WeakReadonlyArray_array, "f").length;
    }
}
exports.default = WeakReadonlyArray;
