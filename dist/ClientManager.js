"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Intents_1 = require("./Intents");
class ClientManager {
    constructor(option) {
        const clientOption = {
            intents: [Intents_1.IntentFlags.GUILDS, Intents_1.IntentFlags.GUILD_MESSAGES]
        };
        if (option.intents !== undefined) {
            clientOption.intents = option.intents;
        }
        this.client = new discord_js_1.Client(clientOption);
        this._clientOption = clientOption;
    }
}
exports.default = ClientManager;
