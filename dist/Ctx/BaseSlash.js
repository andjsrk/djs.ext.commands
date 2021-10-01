"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Interaction_1 = require("./Interaction");
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
class BaseSlash extends Interaction_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        this.interaction = option.interaction;
        const commandName = this.interaction.commandName;
        this.command = this.bot.commands.find(command => command.type === 'slash' && [command.name, ...command.aliases].includes(commandName));
        this.name = commandName;
        this.args = this.parseRawToArgs(this.interaction.options);
    }
    parseRawToArgs(raw) {
        const args = [];
        const argDefinitions = [...this.command.argDefinitions];
        for (const argDefinition of argDefinitions) {
            const argName = argDefinition.name;
            const pureArgType = argDefinition.type.replace(/\?$/, '');
            switch (pureArgType) {
                case 'string':
                    args.push(raw.getString(argName));
                    break;
                case 'number':
                    args.push(raw.getNumber(argName));
                    break;
                case 'integer':
                    args.push(raw.getInteger(argName));
                    break;
                case 'boolean':
                    args.push(raw.getBoolean(argName));
                    break;
                case 'user':
                    args.push(raw.getUser(argName));
                    break;
                case 'role':
                    let role = raw.getRole(argName);
                    if (role !== null && this.bot.client.guilds.cache.get(this.interaction.guildId).roles.cache.get(role.id) === undefined) {
                        role = null;
                    }
                    args.push(role);
                    break;
                case 'mentionable':
                    let mentionable = raw.getMentionable(argName);
                    if (mentionable !== null && !(mentionable instanceof discord_js_1.User) && !(mentionable instanceof discord_js_1.Role) && !(mentionable instanceof discord_js_1.GuildMember)) {
                        mentionable = null;
                    }
                    args.push(mentionable);
                    break;
                case 'channel':
                    let channel = raw.getChannel(argName);
                    if (channel !== null && this.bot.client.channels.cache.get(channel.id) === undefined) {
                        channel = null;
                    }
                    args.push(channel);
                    break;
            }
        }
        return args;
    }
}
exports.default = BaseSlash;
