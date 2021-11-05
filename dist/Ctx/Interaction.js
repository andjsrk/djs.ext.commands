"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Base_1 = require("./Base");
class Interaction extends Base_1.default {
    constructor(option) {
        super({ bot: option.bot });
        const { interaction } = option;
        this.channel = interaction.channel;
        this.guild = interaction.guild;
        this.interaction = interaction;
        this.user = interaction.member ?? interaction.user;
    }
    async send(content, option = {}) {
        const dSendOption = typeof content === 'string'
            ? { content }
            : content instanceof discord_js_1.MessageEmbed
                ? { embeds: [content] }
                : typeof content === 'object' && content !== null
                    ? content
                    : (() => { throw new TypeError('invalid type'); })();
        const sendOption = typeof content === 'string' || content instanceof discord_js_1.MessageEmbed
            ? option
            : typeof content === 'object' && content !== null
                ? content
                : (() => { throw new TypeError('invalid type'); })();
        const reply = await this.interaction.reply({ ...dSendOption, fetchReply: true });
        const sentReply = this.interaction.channel?.messages.cache.get(reply.id);
        if (sentReply !== undefined) {
            if (sendOption.deleteAfter !== undefined) {
                setTimeout(async () => {
                    if (sentReply.deletable) {
                        await sentReply.delete();
                    }
                }, sendOption.deleteAfter);
            }
        }
        return sentReply;
    }
}
exports.default = Interaction;
