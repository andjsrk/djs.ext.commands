"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(option) {
        this.bot = option.bot;
        this.client = this.bot.client;
    }
}
exports.default = Base;
