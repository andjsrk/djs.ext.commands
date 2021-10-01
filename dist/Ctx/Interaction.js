"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Base_1 = require("./Base");
class Interaction extends Base_1.default {
    constructor(option) {
        super({ bot: option.bot });
        this.interaction = option.interaction;
        this.guild = this.interaction.guild;
        this.channel = this.interaction.channel;
        this.user = this.interaction.member ?? this.interaction.user;
    }
    async send(content, option = {}) {
        const dSendOption = typeof content === 'string'
            ? { content }
            : content instanceof discord_js_1.MessageEmbed
                ? { embeds: [content] }
                : typeof content === 'object'
                    ? content
                    : (() => { throw new TypeError('invalid type'); })();
        const sendOption = typeof content === 'string' || content instanceof discord_js_1.MessageEmbed
            ? option
            : typeof content === 'object'
                ? content
                : (() => { throw new TypeError(); })();
        await this.interaction.reply(dSendOption);
        const fetchedReply = await this.interaction.fetchReply();
        const sentMsg = this.interaction.channel?.messages.cache.get(fetchedReply.id);
        if (sentMsg !== undefined) {
            if (sendOption.deleteAfter !== undefined) {
                setTimeout(() => {
                    if (sentMsg.deletable) {
                        sentMsg.delete();
                    }
                }, sendOption.deleteAfter);
            }
        }
        return sentMsg;
    }
}
exports.default = Interaction;
