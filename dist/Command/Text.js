"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
class Text extends Base_1.default {
    constructor(option) {
        super({ bot: option.bot, name: option.name, aliases: option.aliases });
        this.type = 'text';
        if (option.argTypes !== undefined) {
            const firstRestArgIndex = option.argTypes.findIndex(argType => argType.startsWith('...'));
            if (0 < option.argTypes.length - 1 - firstRestArgIndex) { // there should not be any argument types back of rest argument type
                throw new Error(`there is argument type back of rest argument type`);
            }
        }
        this.argTypes = [...(option.argTypes ?? [])];
        this.callback = option.callback;
    }
}
exports.default = Text;
