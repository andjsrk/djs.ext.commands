import * as $path from 'path'
import {
	Channel, Client, Collection, Message, User,
	MessageMentionOptions, PresenceData, Snowflake, TextBasedChannels,
} from 'discord.js'
import BotEventManager, { BotEvents, BotEventListenerMethodName } from './BotEventManager'
import * as Ctx from './Ctx'
import * as Command from './Command'
import { TextCommandInitOption } from './Command/Text'
import SlashCommand, { SlashCommandInitOption } from './Command/Slash'
import { SubSlashCommandInitOption } from './Command/SubSlash'
import type { IntentFlags } from './Intents'
import WeakReadonlyArray from './WeakReadonlyArray'

type WeakRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export namespace ListenerOption {
	export interface Button {
		customId?: string
	}
	export interface SelectMenu {
		customId?: string
	}
}

export interface BotInitOption {
	readonly prefix?: string
	readonly intents?: Array<IntentFlags>
	readonly ownerId?: Snowflake
}
export default class Bot extends BotEventManager {
	public readonly prefix: string
	public readonly cachedMessages: WeakReadonlyArray<Message>
	public commands: Array<Command.Text | Command.Slash>
	public channels: Array<Channel>
	public readonly ownerId: Snowflake | null
	constructor(option: BotInitOption = {}) {
		super({ intents: option.intents })
		if (option.prefix !== undefined && typeof option.prefix !== 'string') {
			throw new TypeError('type of prefix is not string')
		} else if (option.ownerId !== undefined && typeof option.ownerId !== 'string') {
			throw new TypeError('type of ownerId is not string')
		} else {
			this.prefix = option.prefix ?? ''
			// #region listener init
			this.addRawListener(() => {
				this.channels.push(...this.client.channels.cache.values())
				const commandDataList = (this.commands.filter(command => command.type === 'slash') as Array<Command.Slash>).map(command => command.toRawArray()).flat(1)
				for (const [ _, guild ] of this.client.guilds.cache) {
					guild.commands.set(commandDataList)
				}
			}, 'ready')
			this.addRawListener(message => {
				for (const command of this.commands.filter(command => command.type === 'text') as Array<Command.Text>) {
					if (command.argTypes.length < 1) {
						const matchedAliase = [ command.name, ...command.aliases ].find(aliase => message.content === `${this.prefix}${aliase}`)
						if (matchedAliase !== undefined) {
							const textCommandCtx = new Ctx.Text({ bot: this, message, command, matchedAliase })
							command.callback(textCommandCtx)
						}
					} else {
						const matchedAliase = [ command.name, ...command.aliases ].find(aliase => message.content.startsWith(`${this.prefix}${aliase} `))
						if (matchedAliase !== undefined) {
							const textCommandCtx = new Ctx.Text({ bot: this, message, command, matchedAliase })
							command.callback(textCommandCtx)
						}
					}
				}
			}, 'messageCreate')
			this.addRawListener(interaction => {
				if (interaction.isButton()) {
					for (const listener of this._eventListeners.buttonPress ?? []) {
						listener(new Ctx.Button({ bot: this, interaction }))
					}
				} else if (interaction.isSelectMenu()) {
					for (const listener of this._eventListeners.selectMenuSelect ?? []) {
						listener(new Ctx.SelectMenu({ bot: this, interaction }))
					}
				} else if (interaction.isCommand()) {
					if (interaction.options.getSubcommand(false) === null) {
						for (const command of this.commands.filter(command => command.type === 'slash') as Array<Command.Slash>) {
							if ([ command.name, ...command.aliases ].includes(interaction.commandName)) {
								command.callback(new Ctx.Slash({ bot: this, interaction, command }))
								break
							}
						}
					} else {
						for (const command of this.commands.filter(command => command.type === 'slash') as Array<Command.Slash>) {
							const foundSubCommand = command.subCommands.find(subCommand => [ subCommand.name, ...subCommand.aliases ].includes(interaction.commandName))
							if (foundSubCommand !== undefined) {
								foundSubCommand.callback(new Ctx.SubSlash({ bot: this, interaction, mainCommand: command }))
								break
							}
						}
					}
				}
			}, 'interactionCreate')
			// #endregion listener init
			this.commands ??= []
			this.channels ??= []
			this.cachedMessages = new WeakReadonlyArray(
				...this.client.guilds.cache
					.reduce((p, c) =>
						p.concat(
							(c.channels.cache
								.filter(channel => channel.isText()) as Collection<Snowflake, TextBasedChannels>)
								.reduce((_p, _c) =>
									_p.concat([ ..._c.messages.cache.values() ]),
									[] as Array<Message>
								)
						),
						[] as Array<Message>
					)
			)
			for (const [ _, guild ] of this.client.guilds.cache) {
				for (const [ _, channel ] of guild.channels.cache) {
					if (channel.isText()) {
						channel.messages['_add']
					}
				}
			}
		}
	}
	// #region decorator
	public static event(eventName: keyof BotEvents): (bot: Bot, listenerName: string) => void
	public static event(bot: Bot, listenerName: BotEventListenerMethodName): void
	public static event(first: keyof BotEvents | Bot, listenerName?: BotEventListenerMethodName) {
		if (listenerName === undefined) {
			const eventName = first as keyof BotEvents
			return (bot: Bot, _listenerName: string) => {
				bot.addListener((bot[_listenerName as keyof typeof bot] as (...args: Array<any>) => any).bind(bot), eventName)
			}
		} else {
			const bot = first as Bot
			if (!listenerName.startsWith('on')) {
				throw new Error('name of listener is not starting with \'on\'')
			} else {
				const eventName = listenerName.replace(/^on([A-Z])/, (_, $1) => $1.toLowerCase()) as keyof BotEvents
				bot.addListener((bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any).bind(bot), eventName)
			}
		}
	}
	public static textCommand(option: Partial<Omit<TextCommandInitOption, 'callback'>> = {}) {
		return (bot: Bot, listenerName: string) => {
			bot.addCommand(
				new Command.Text({
					name: option.name ?? listenerName,
					aliases: option.aliases ?? [],
					argTypes: option.argTypes,
					callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any).bind(bot),
				})
			)
		}
	}
	public static slashCommand(option: Partial<Omit<SlashCommandInitOption, 'callback'>> = {}) {
		return (bot: Bot, listenerName: string) => {
			bot.addCommand(
				new Command.Slash({
					name: option.name ?? listenerName,
					aliases: option.aliases,
					description: option.description,
					argDefinitions: option.argDefinitions,
					noSubCommand: option.noSubCommand,
					callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any).bind(bot),
				})
			)
		}
	}
	public static subSlashCommand(option: WeakRequired<Partial<Omit<SubSlashCommandInitOption, 'callback'>>, 'for'>) {
		return (bot: Bot, listenerName: string) => {
			if (option.for === undefined) {
				throw new Error('for is required option.')
			} else {
				const foundCommand = (bot.commands.filter(command => command.type === 'slash') as Array<SlashCommand>).find(command => [ command.name, ...command.aliases ].includes(option.for))
				if (foundCommand === undefined) {
					throw new Error(`no such command: ${option.for}`)
				} else {
					foundCommand.addSubCommand(
						new Command.SubSlash({
							for: option.for,
							name: option.name ?? listenerName,
							aliases: option.aliases,
							description: option.description,
							argDefinitions: option.argDefinitions,
							mainCommand: foundCommand,
							callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any).bind(bot),
						})
					)
				}
			}
		}
	}
	public static button(option: ListenerOption.Button = {}) {
		return (bot: Bot, listenerName: string) => {
			const listener = bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any
			bot.addListener(ctx => {
				if (option.customId !== undefined) {
					if (ctx.customId === option.customId) {
						listener.call(ctx.bot, ctx)
					}
				} else {
					listener.call(ctx.bot, ctx)
				}
			}, 'buttonPress')
		}
	}
	public static selectMenu(option: ListenerOption.SelectMenu = {}) {
		return (bot: Bot, listenerName: string) => {
			const listener = bot[listenerName as keyof typeof bot] as (...args: Array<any>) => any
			bot.addListener(ctx => {
				if (option.customId !== undefined) {
					if (ctx.customId === option.customId) {
						listener.call(ctx.bot, ctx)
					}
				} else {
					listener.call(ctx.bot, ctx)
				}
			}, 'selectMenuSelect')
		}
	}
	// #endregion decorator
	public get activities() {
		return this.client.options.presence?.activities?.map(activity => ({ ...activity }))
	}
	public get allowedMentions() {
		const allowedMentionsOption = this.client.options.allowedMentions
		if (allowedMentionsOption === undefined) {
			return undefined
		} else {
			const option: MessageMentionOptions = {}
			if (allowedMentionsOption.parse !== undefined) {
				option.parse = [ ...allowedMentionsOption.parse ]
			}
			if (allowedMentionsOption.repliedUser !== undefined) {
				option.repliedUser = allowedMentionsOption.repliedUser
			}
			if (allowedMentionsOption.roles !== undefined) {
				option.roles = [ ...allowedMentionsOption.roles ]
			}
			if (allowedMentionsOption.users !== undefined) {
				option.users = [ ...allowedMentionsOption.users ]
			}
			return option
		}
	}
	public get intents() {
		return [ ...this._clientOption.intents ]
	}
	public absorbCommands(bot: typeof Bot) {
		if (!(bot.prototype instanceof Bot)) {
			throw new TypeError('target is not extending class Bot')
		} else {
			for (const command of bot.prototype.commands ?? []) {
				if (command.type === 'text') {
					this.addCommand(
						new Command.Text({
							name: command.name,
							aliases: [ ...command.aliases ],
							argTypes: [ ...command.argTypes ],
							callback: command.callback,
						})
					)
				} else {
					const createdCommand = new Command.Slash({
						name: command.name,
						aliases: [ ...command.aliases ],
						description: command.description,
						argDefinitions: command.argDefinitions.map(argDefinition => ({ ...argDefinition })),
						noSubCommand: command.noSubCommand,
						callback: command.callback,
					})
					if (!command.noSubCommand) {
						for (const subCommand of command.subCommands) {
							createdCommand.addSubCommand(
								new Command.SubSlash({
									for: subCommand.for,
									name: subCommand.name,
									aliases: [ ...subCommand.aliases ],
									description: subCommand.description,
									argDefinitions: subCommand.argDefinitions,
									mainCommand: createdCommand,
									callback: subCommand.callback,
								})
							)
						}
					}
					this.addCommand(createdCommand)
				}
			}
		}
	}
	public absorbCommandsSyncByPath(path: string) {
		let imported
		try {
			imported = require($path.isAbsolute(path) ? path : $path.join(process.cwd(), path)) as { default: typeof Bot }
		} catch (error: any) {
			if (error.code === 'MODULE_NOT_FOUND') {
				throw new Error(`no file found with path '${path}'`)
			} else {
				throw error
			}
		}
		if (imported?.default === undefined) {
			throw new TypeError('source file is not exporting class Bot')
		} else {
			return this.absorbCommands(imported.default)
		}
	}
	public async absorbCommandsByPath(path: string) {
		let imported
		try {
			imported = await import($path.isAbsolute(path) ? path : $path.join(process.cwd(), path)) as { default: typeof Bot }
		} catch (error: any) {
			if (error.code === 'MODULE_NOT_FOUND') {
				throw new Error(`no file found with path '${path}'`)
			} else {
				throw error
			}
		}
		if (imported?.default === undefined) {
			throw new TypeError('source file is not exporting class Bot')
		} else {
			return this.absorbCommands(imported.default)
		}
	}
	public addCommand(command: Command.Text | Command.Slash) {
		if (!(command instanceof Command.Text) && !(command instanceof Command.Slash)) {
			throw new TypeError('type of command is not TextCommand or SlashCommand')
		} else {
			this.commands ??= []
			this.commands.push(command)
		}
	}
	public async changePresence(option: Omit<PresenceData, 'shardId'>) {
		if (!this.isReady()) {
			throw new Error('client is not readied')
		} else {
			this.client.user.setPresence(option)
		}
	}
	public async createGuild(name: string, option: { region?: string, icon?: string, code?: string }) {
		let createdGuild
		if (option.code !== undefined) {
			const template = await this.client.fetchGuildTemplate(option.code)
			createdGuild = await template.createGuild(name, option.icon)
		} else {
			createdGuild = await this.client.guilds.create(name, { icon: option.icon })
		}
		if (option.region !== undefined) {
			await createdGuild.setPreferredLocale(option.region)
		}
		return createdGuild
	}
	public async fetchApplicationInfo() {
		return await this.client.application?.fetch()
	}
	public isOwner(user: User) {
		return this.ownerId === user.id
	}
	public isReady(): this is this & { client: Client<true> } {
		return this.client.readyAt !== null
	}
	public async run(token: string): Promise<void> {
		if (typeof token !== 'string') {
			throw new TypeError('type of token is not string')
		} else {
			await this.client.login(token)
		}
	}
}
