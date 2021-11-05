"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSlash_1 = require("./BaseSlash");
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
class SubSlash extends BaseSlash_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        const { mainCommand } = option;
        const commandName = this.interaction.options.getSubcommand();
        this.command = mainCommand.subCommands.find(subCommand => [subCommand.name, ...subCommand.aliases].includes(commandName));
        this.mainCommand = mainCommand;
        this.group = this.interaction.options.getSubcommandGroup(false);
        this.name = commandName;
        this.type = 'subSlash';
    }
}
exports.default = SubSlash;
