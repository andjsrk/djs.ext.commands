"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentInteraction_1 = require("./ComponentInteraction");
class SelectMenu extends ComponentInteraction_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        this.selected = [...this.interaction.values];
        this.type = 'selectMenu';
    }
}
exports.default = SelectMenu;
