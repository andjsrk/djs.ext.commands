"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = require("./Interaction");
class ComponentInteraction extends Interaction_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        this.customId = option.interaction.customId;
    }
}
exports.default = ComponentInteraction;
