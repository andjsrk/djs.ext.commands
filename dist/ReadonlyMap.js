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
var _map;
Object.defineProperty(exports, "__esModule", { value: true });
const ReadonlyMap = class {
    constructor(map) {
        _map.set(this, void 0);
        __classPrivateFieldSet(this, _map, map, "f");
    }
    [(_map = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _map, "f")[Symbol.iterator]();
    }
    entries() {
        return __classPrivateFieldGet(this, _map, "f").entries();
    }
    get(key) {
        return __classPrivateFieldGet(this, _map, "f").get(key);
    }
    has(key) {
        return __classPrivateFieldGet(this, _map, "f").has(key);
    }
    keys() {
        return __classPrivateFieldGet(this, _map, "f").keys();
    }
    values() {
        return __classPrivateFieldGet(this, _map, "f").values();
    }
    get size() {
        return __classPrivateFieldGet(this, _map, "f").size;
    }
};
exports.default = ReadonlyMap;
