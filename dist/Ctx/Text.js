"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Base_1 = require("./Base");
class Text extends Base_1.default {
    constructor(option) {
        super({ bot: option.bot });
        this.message = option.message;
        this.command = option.command;
        this.args = this.parseRawToArgs(this.message.content);
        this.channel = this.message.channel;
        this.content = this.message.content;
        this.guild = this.message.guild;
        this.matchedAliase = option.matchedAliase;
        this.me = this.guild?.me ?? this.bot.client.user;
        this.user = this.message.member ?? this.message.author;
    }
    parseRawToArgs(raw) {
        const args = [];
        const rawArgs = raw.replace(`${this.bot.prefix}${this.matchedAliase}${0 < this.command.argTypes.length ? ' ' : ''}`, '').split(' ');
        const isPureArgType = (argType) => !argType.startsWith('...');
        for (const argType of this.command.argTypes) {
            if (isPureArgType(argType)) {
                const shifted = rawArgs.shift();
                if (shifted === undefined) {
                    args.push(null);
                }
                else {
                    args.push(this.parseOneArg(argType, shifted));
                }
            }
            else {
                const pureArgType = argType.replace('...', '');
                args.push(rawArgs.map(rawArg => this.parseOneArg(pureArgType, rawArg)));
                break;
            }
        }
        return args;
    }
    parseOneArg(argType, content) {
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
            if (matched !== null && matched[0] !== undefined) {
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
                }
            }
            else {
                return null;
            }
        }
    }
    async reply(content) {
        if (typeof content === 'string') {
            await this.message.reply({ content });
        }
        else if (content instanceof discord_js_1.MessageEmbed) {
            await this.message.reply({ embeds: [content] });
        }
        else {
            await this.message.reply(content);
        }
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
        const sentMsg = await this.channel.send(dSendOption);
        if (sendOption.deleteAfter !== undefined) {
            setTimeout(() => {
                if (sentMsg.deletable) {
                    sentMsg.delete();
                }
            }, sendOption.deleteAfter);
        }
        return sentMsg;
    }
}
exports.default = Text;
