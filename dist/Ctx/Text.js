"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Base_1 = require("./Base");
class Text extends Base_1.default {
    constructor(option) {
        super({ bot: option.bot });
        const { message } = option;
        this.channel = message.channel;
        this.command = option.command;
        this.content = message.content;
        this.guild = message.guild;
        this.matchedAlias = option.matchedAlias;
        this.me = this.guild?.me ?? this.bot.client.user;
        this.message = message;
        this.type = 'text';
        this.user = this.message.member ?? this.message.author;
        this.args = this._parseRaw(message.content);
    }
    _parseOneRawArg(argType, content) {
        if (argType === 'string') {
            return content;
        }
        else {
            const regexp = {
                number: /^-?[0-9]+(?:\.[0-9]+)?$/,
                integer: /^-?[0-9]+$/,
                naturalNumber: /^[0-9]+$/,
                decimal: /^-?[0-9]+(?:\.[0-9]+)?$/,
                boolean: /^(?:t|T)rue|(?:f|F)alse$/,
                user: /^<@!([0-9]+)>$/,
                member: /^<@!([0-9]+)>$/,
                role: /^<@&([0-9]+)>$/,
                channel: /^<#([0-9]+)>$/,
                textChannel: /^<#([0-9]+)>$/,
                voiceChannel: /^<#([0-9]+)>$/,
            };
            const matched = content.match(regexp[argType]);
            if (matched?.[0] !== undefined) {
                switch (argType) {
                    case 'number':
                        return Number(matched[0]);
                    case 'integer':
                    case 'naturalNumber':
                        return parseInt(matched[0], 10);
                    case 'decimal':
                        return parseFloat(matched[0]);
                    case 'boolean':
                        return matched[0].toLowerCase() === 'true';
                    case 'user':
                        return this.bot.client.users.cache.get(matched[1]) ?? null;
                    case 'member':
                        return this.message.guild?.members.cache.get(matched[1]) ?? null;
                    case 'role':
                        return this.message.guild?.roles.cache.get(matched[1]) ?? null;
                    case 'channel':
                        return this.message.guild?.channels.cache.get(matched[1]) ?? null;
                    case 'textChannel':
                        return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').get(matched[1]) ?? null;
                    case 'voiceChannel':
                        return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').get(matched[1]) ?? null;
                    default:
                        return null;
                }
            }
            else {
                return null;
            }
        }
    }
    _parseRaw(raw) {
        const args = [];
        const rawArgs = raw.replace(`${this.bot.prefix}${this.matchedAlias}${this.command.argTypes.length !== 0 ? ' ' : ''}`, '').split(' ');
        const isPureArgType = (argType) => !argType.startsWith('...');
        for (const argType of this.command.argTypes) {
            if (isPureArgType(argType)) {
                const shifted = rawArgs.shift();
                if (shifted === undefined) {
                    args.push(null);
                }
                else {
                    args.push(this._parseOneRawArg(argType, shifted));
                }
            }
            else {
                const pureArgType = argType.replace('...', '');
                args.push(rawArgs.map(rawArg => this._parseOneRawArg(pureArgType, rawArg)));
                break;
            }
        }
        return args;
    }
    async reply(content) {
        let repliedMessage;
        if (typeof content === 'string') {
            repliedMessage = await this.message.reply({ content });
        }
        else if (content instanceof discord_js_1.MessageEmbed) {
            repliedMessage = await this.message.reply({ embeds: [content] });
        }
        else {
            repliedMessage = await this.message.reply(content);
        }
        return repliedMessage;
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
                : (() => { throw new TypeError(); })();
        const sentMsg = await this.channel.send(dSendOption);
        if (sendOption.deleteAfter !== undefined) {
            setTimeout(async () => {
                if (sentMsg.deletable) {
                    await sentMsg.delete();
                }
            }, sendOption.deleteAfter);
        }
        return sentMsg;
    }
}
exports.default = Text;
