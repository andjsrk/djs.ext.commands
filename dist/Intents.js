"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intents = exports.IntentFlags = void 0;
var IntentFlags;
(function (IntentFlags) {
    IntentFlags[IntentFlags["GUILDS"] = 1] = "GUILDS";
    IntentFlags[IntentFlags["GUILD_MEMBERS"] = 2] = "GUILD_MEMBERS";
    IntentFlags[IntentFlags["GUILD_BANS"] = 4] = "GUILD_BANS";
    IntentFlags[IntentFlags["GUILD_EMOJIS_AND_STICKERS"] = 8] = "GUILD_EMOJIS_AND_STICKERS";
    IntentFlags[IntentFlags["GUILD_INTEGRATIONS"] = 16] = "GUILD_INTEGRATIONS";
    IntentFlags[IntentFlags["GUILD_WEBHOOKS"] = 32] = "GUILD_WEBHOOKS";
    IntentFlags[IntentFlags["GUILD_INVITES"] = 64] = "GUILD_INVITES";
    IntentFlags[IntentFlags["GUILD_VOICE_STATES"] = 128] = "GUILD_VOICE_STATES";
    IntentFlags[IntentFlags["GUILD_PRESENCES"] = 256] = "GUILD_PRESENCES";
    IntentFlags[IntentFlags["GUILD_MESSAGES"] = 512] = "GUILD_MESSAGES";
    IntentFlags[IntentFlags["GUILD_MESSAGE_REACTIONS"] = 1024] = "GUILD_MESSAGE_REACTIONS";
    IntentFlags[IntentFlags["GUILD_MESSAGE_TYPING"] = 2048] = "GUILD_MESSAGE_TYPING";
    IntentFlags[IntentFlags["DIRECT_MESSAGES"] = 4096] = "DIRECT_MESSAGES";
    IntentFlags[IntentFlags["DIRECT_MESSAGE_REACTIONS"] = 8192] = "DIRECT_MESSAGE_REACTIONS";
    IntentFlags[IntentFlags["DIRECT_MESSAGE_TYPING"] = 16384] = "DIRECT_MESSAGE_TYPING";
})(IntentFlags = exports.IntentFlags || (exports.IntentFlags = {}));
class Intents {
}
exports.Intents = Intents;
Intents.FLAG = IntentFlags;
