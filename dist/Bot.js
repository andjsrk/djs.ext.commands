"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $path = require("path");
const BotEventManager_1 = require("./BotEventManager");
const Ctx = require("./Ctx");
const Command = require("./Command");
const WeakReadonlyArray_1 = require("./WeakReadonlyArray");
class Bot extends BotEventManager_1.default {
    constructor(option = {}) {
        super({ intents: option.intents });
        this.client.shard?.broadcastEval;
        if (option.prefix !== undefined && typeof option.prefix !== 'string') {
            throw new TypeError('type of prefix is not string');
        }
        else {
            this.prefix = option.prefix ?? '';
            // #region listener init
            this.addRawListener(() => {
                this.channels.push(...this.client.channels.cache.values());
                const commandDataList = this.commands.filter(command => command.type === 'slash').map(command => command.toRawArray()).flat(1);
                for (const [_, guild] of this.client.guilds.cache) {
                    guild.commands.set(commandDataList);
                }
            }, 'ready');
            this.addRawListener(message => {
                for (const command of this.commands.filter(command => command.type === 'text')) {
                    if (command.argTypes.length < 1) {
                        const matchedAliase = [command.name, ...command.aliases].find(aliase => message.content === `${this.prefix}${aliase}`);
                        if (matchedAliase !== undefined) {
                            const textCommandCtx = new Ctx.Text({ bot: this, message, command, matchedAliase });
                            command.callback(textCommandCtx);
                        }
                    }
                    else {
                        const matchedAliase = [command.name, ...command.aliases].find(aliase => message.content.startsWith(`${this.prefix}${aliase} `));
                        if (matchedAliase !== undefined) {
                            const textCommandCtx = new Ctx.Text({ bot: this, message, command, matchedAliase });
                            command.callback(textCommandCtx);
                        }
                    }
                }
            }, 'messageCreate');
            this.addRawListener(interaction => {
                if (interaction.isButton()) {
                    for (const listener of this._eventListeners.buttonPress ?? []) {
                        listener(new Ctx.Button({ bot: this, interaction }));
                    }
                }
                else if (interaction.isSelectMenu()) {
                    for (const listener of this._eventListeners.selectMenuSelect ?? []) {
                        listener(new Ctx.SelectMenu({ bot: this, interaction }));
                    }
                }
                else if (interaction.isCommand()) {
                    if (interaction.options.getSubcommand(false) === null) {
                        for (const command of this.commands.filter(command => command.type === 'slash')) {
                            if ([command.name, ...command.aliases].includes(interaction.commandName)) {
                                command.callback(new Ctx.Slash({ bot: this, interaction, command }));
                                break;
                            }
                        }
                    }
                    else {
                        for (const command of this.commands.filter(command => command.type === 'slash')) {
                            const foundSubCommand = command.subCommands.find(subCommand => [subCommand.name, ...subCommand.aliases].includes(interaction.commandName));
                            if (foundSubCommand !== undefined) {
                                foundSubCommand.callback(new Ctx.SubSlash({ bot: this, interaction, mainCommand: command }));
                                break;
                            }
                        }
                    }
                }
            }, 'interactionCreate');
            // #endregion listener init
            this.commands ??= [];
            this.channels ??= [];
            this.cachedMessages = new WeakReadonlyArray_1.default(...this.client.guilds.cache
                .reduce((p, c) => p.concat(c.channels.cache
                .filter(channel => channel.isText())
                .reduce((_p, _c) => _p.concat([..._c.messages.cache.values()]), [])), []));
            for (const [_, guild] of this.client.guilds.cache) {
                for (const [_, channel] of guild.channels.cache) {
                    if (channel.isText()) {
                        channel.messages['_add'];
                    }
                }
            }
        }
    }
    static event(first, listenerName) {
        if (listenerName === undefined) {
            const eventName = first;
            return (bot, _listenerName) => {
                bot.addListener(bot[_listenerName].bind(this), eventName);
            };
        }
        else {
            const bot = first;
            if (!listenerName.startsWith('on')) {
                throw new Error('name of listener is not starting with \'on\'');
            }
            else {
                const eventName = listenerName.replace(/^on([A-Z])/, (_, $1) => $1.toLowerCase());
                bot.addListener(bot[listenerName].bind(this), eventName);
            }
        }
    }
    static textCommand(option = {}) {
        return (bot, listenerName) => {
            bot.addCommand(new Command.Text({
                bot,
                name: option.name ?? listenerName,
                aliases: option.aliases ?? [],
                argTypes: option.argTypes,
                callback: bot[listenerName].bind(this),
            }));
        };
    }
    static slashCommand(option = {}) {
        return (bot, listenerName) => {
            bot.addCommand(new Command.Slash({
                bot,
                name: option.name ?? listenerName,
                aliases: option.aliases,
                description: option.description,
                argDefinitions: option.argDefinitions,
                noSubCommand: option.noSubCommand,
                callback: bot[listenerName].bind(this),
            }));
        };
    }
    static subSlashCommand(option) {
        return (bot, listenerName) => {
            if (option.for === undefined) {
                throw new Error('for is required option.');
            }
            else {
                const foundCommand = bot.commands.filter(command => command.type === 'slash').find(command => [command.name, ...command.aliases].includes(option.for));
                if (foundCommand === undefined) {
                    throw new Error(`no such command: ${option.for}`);
                }
                else {
                    foundCommand.addSubCommand(new Command.SubSlash({
                        bot,
                        for: option.for,
                        name: option.name ?? listenerName,
                        aliases: option.aliases,
                        description: option.description,
                        argDefinitions: option.argDefinitions,
                        mainCommand: foundCommand,
                        callback: bot[listenerName].bind(this),
                    }));
                }
            }
        };
    }
    static button(option = {}) {
        return (bot, listenerName) => {
            const listener = bot[listenerName];
            bot.addListener(ctx => {
                if (option.customId !== undefined) {
                    if (ctx.customId === option.customId) {
                        listener.call(ctx.bot, ctx);
                    }
                }
                else {
                    listener.call(ctx.bot, ctx);
                }
            }, 'buttonPress');
        };
    }
    static selectMenu(option = {}) {
        return (bot, listenerName) => {
            const listener = bot[listenerName];
            bot.addListener(ctx => {
                if (option.customId !== undefined) {
                    if (ctx.customId === option.customId) {
                        listener.call(ctx.bot, ctx);
                    }
                }
                else {
                    listener.call(ctx.bot, ctx);
                }
            }, 'selectMenuSelect');
        };
    }
    // #endregion decorator
    get activities() {
        return this.client.options.presence?.activities?.map(activity => ({ ...activity }));
    }
    get allowedMentions() {
        const allowedMentionsOption = this.client.options.allowedMentions;
        if (allowedMentionsOption === undefined) {
            return undefined;
        }
        else {
            const option = {};
            if (allowedMentionsOption.parse !== undefined) {
                option.parse = [...allowedMentionsOption.parse];
            }
            if (allowedMentionsOption.repliedUser !== undefined) {
                option.repliedUser = allowedMentionsOption.repliedUser;
            }
            if (allowedMentionsOption.roles !== undefined) {
                option.roles = [...allowedMentionsOption.roles];
            }
            if (allowedMentionsOption.users !== undefined) {
                option.users = [...allowedMentionsOption.users];
            }
            return option;
        }
    }
    get intents() {
        return [...this._clientOption.intents];
    }
    absorbCommands(bot) {
        if (!(bot.prototype instanceof Bot)) {
            throw new TypeError('target is not extending class Bot');
        }
        else {
            for (const command of bot.prototype.commands ?? []) {
                if (command.type === 'text') {
                    this.addCommand(new Command.Text({
                        bot: this,
                        name: command.name,
                        aliases: [...command.aliases],
                        argTypes: [...command.argTypes],
                        callback: command.callback,
                    }));
                }
                else {
                    const createdCommand = new Command.Slash({
                        bot: this,
                        name: command.name,
                        aliases: [...command.aliases],
                        description: command.description,
                        argDefinitions: command.argDefinitions.map(argDefinition => ({ ...argDefinition })),
                        noSubCommand: command.noSubCommand,
                        callback: command.callback,
                    });
                    if (!command.noSubCommand) {
                        for (const subCommand of command.subCommands) {
                            createdCommand.addSubCommand(new Command.SubSlash({
                                bot: this,
                                for: subCommand.for,
                                name: subCommand.name,
                                aliases: [...subCommand.aliases],
                                description: subCommand.description,
                                argDefinitions: subCommand.argDefinitions,
                                mainCommand: createdCommand,
                                callback: subCommand.callback,
                            }));
                        }
                    }
                    this.addCommand(createdCommand);
                }
            }
        }
    }
    absorbCommandsSyncByPath(path) {
        let imported;
        try {
            imported = require($path.isAbsolute(path) ? path : $path.join(process.cwd(), path));
        }
        catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                throw new Error(`no file found with path '${path}'`);
            }
            else {
                throw error;
            }
        }
        if (imported?.default === undefined) {
            throw new TypeError('source file is not exporting class Bot');
        }
        else {
            return this.absorbCommands(imported.default);
        }
    }
    async absorbCommandsByPath(path) {
        let imported;
        try {
            imported = await Promise.resolve().then(() => require($path.isAbsolute(path) ? path : $path.join(process.cwd(), path)));
        }
        catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                throw new Error(`no file found with path '${path}'`);
            }
            else {
                throw error;
            }
        }
        if (imported?.default === undefined) {
            throw new TypeError('source file is not exporting class Bot');
        }
        else {
            return this.absorbCommands(imported.default);
        }
    }
    addCommand(command) {
        if (!(command instanceof Command.Text) && !(command instanceof Command.Slash)) {
            throw new TypeError('type of command is not TextCommand or SlashCommand');
        }
        else {
            this.commands ??= [];
            this.commands.push(command);
        }
    }
    async changePresence(option) {
        if (!this.isReady()) {
            throw new Error('client is not readied');
        }
        else {
            this.client.user.setPresence(option);
        }
    }
    async createGuild(name, option) {
        let createdGuild;
        if (option.code !== undefined) {
            const template = await this.client.fetchGuildTemplate(option.code);
            createdGuild = await template.createGuild(name, option.icon);
        }
        else {
            createdGuild = await this.client.guilds.create(name, { icon: option.icon });
        }
        if (option.region !== undefined) {
            await createdGuild.setPreferredLocale(option.region);
        }
        return createdGuild;
    }
    async fetchApplicationInfo() {
        return await this.client.application?.fetch();
    }
    isReady() {
        return this.client.readyAt !== null;
    }
    isOwner(user) {
        return this.client.application?.owner?.id === user.id;
    }
    async run(token) {
        if (typeof token !== 'string') {
            throw new TypeError('type of token is not string');
        }
        else {
            await this.client.login(token);
        }
    }
}
exports.default = Bot;
