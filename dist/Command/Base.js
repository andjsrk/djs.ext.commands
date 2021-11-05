"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(option) {
        if (typeof option.name !== 'string') {
            throw new TypeError('type of name is not string');
        }
        else if (option.aliases !== undefined && !Array.isArray(option.aliases)) {
            throw new TypeError('type of aliases is not array');
        }
        else if (option.aliases?.some(alias => typeof alias !== 'string') ?? false) {
            throw new TypeError('type of item of aliases is not string');
        }
        else {
            this.name = option.name;
            this.aliases = [...option.aliases ?? []];
        }
    }
}
exports.default = Base;
