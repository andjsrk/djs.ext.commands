"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentInteraction_1 = require("./ComponentInteraction");
class Button extends ComponentInteraction_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        this.type = 'button';
    }
}
exports.default = Button;
