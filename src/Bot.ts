import * as $path from 'path'
import type { Client, Collection, DMChannel, Guild, GuildChannel, GuildEmoji, Invite, Message, User } from 'discord.js'
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import type { ActivitiesOptions, ClientApplication, MessageMentionOptions, PresenceData, Snowflake, TextBasedChannels } from 'discord.js'
import BotEventManager, { BOT_EVENT_NAMES } from './BotEventManager'
import type { BotEventListenerMethodName, BotEvents } from './BotEventManager'
import * as Ctx from './Ctx'
import * as Command from './Command'
import type { TextCommandInitOption } from './Command/Text'
import type { SlashCommandInitOption } from './Command/Slash'
import type { SubSlashCommandInitOption } from './Command/SubSlash'
import type { IntentFlags } from './Intents'
import WeakReadonlyArray from './WeakReadonlyArray'

type WeakRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export interface ButtonListenerOption {
	customId?: string
}
export interface SelectMenuListenerOption {
	customId?: string
}

export interface BotInitOption {
	readonly intents?: Array<IntentFlags>
	readonly ownerId?: Snowflake
	readonly prefix?: string
}
export default class Bot extends BotEventManager {
	protected readonly _eventWaiters: {
		[K in keyof BotEvents]?: Array<{
			check: ((...args: BotEvents[K]) => boolean) | undefined
			resolve: (...args: BotEvents[K]) => void
		}>
	}
	public readonly cachedMessages: WeakReadonlyArray<Message>
	public readonly channels: Array<Exclude<GuildChannel, DMChannel>>
	public commands: Array<Command.Text | Command.Slash> // decorators are must able to assign before init
	public readonly emojis: Array<GuildEmoji>
	public readonly guilds: Array<Guild>
	public readonly ownerId: Snowflake | null
	public readonly prefix: string
	public readonly privateChannels: Array<DMChannel>
	public readonly users: Array<User>
	constructor(option: BotInitOption = {}) {
		super({ intents: option.intents })
		if (option.prefix !== undefined && typeof option.prefix !== 'string') {
			throw new TypeError('type of prefix is not string')
		} else if (option.ownerId !== undefined && typeof option.ownerId !== 'string') {
			throw new TypeError('type of ownerId is not string')
		} else {
			// #region listener init
			this.addRawListener(() => {
				const guildChannels = [ ...this.client.channels.cache.filter(channel => ![ 'DM', 'GROUP_DM', 'UNKNOWN' ].includes(channel.type)).values() as IterableIterator<GuildChannel> ]
				if (guildChannels.length !== 0) {
					this.channels.push(...guildChannels)
				}
				const emojis = [ ...this.client.emojis.cache.values() ]
				if (emojis.length !== 0) {
					this.emojis.push(...emojis)
				}
				const guilds = [ ...this.client.guilds.cache.values() ]
				if (guilds.length !== 0) {
					this.guilds.push(...guilds)
				}
				const privateChannels = [ ...this.client.channels.cache.filter(channel => channel.type === 'DM').values() as IterableIterator<DMChannel> ]
				if (privateChannels.length !== 0) {
					this.privateChannels.push(...privateChannels)
				}
				const users = [ ...this.client.users.cache.values() ]
				if (users.length !== 0) {
					this.users.push(...users)
				}
				const commandDatas = (this.commands.filter(command => command.type === 'slash') as Array<Command.Slash>).map(command => command.toRawArray()).flat(1)
				if (commandDatas.length !== 0) {
					for (const [ _, guild ] of this.client.guilds.cache) {
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						guild.commands.set(commandDatas)
					}
				}
			}, 'ready')
			this.addRawListener(channel => {
				this.channels.push(channel)
			}, 'channelCreate')
			this.addRawListener(emoji => {
				this.emojis.push(emoji)
			}, 'emojiCreate')
			this.addRawListener(async guild => {
				this.guilds.push(guild)
				const commandDatas = (this.commands.filter(command => command.type === 'slash') as Array<Command.Slash>).map(command => command.toRawArray()).flat(1)
				await guild.commands.set(commandDatas)
			}, 'guildCreate')
			this.addRawListener(message => {
				this.cachedMessages['_array'].push(message)
				for (const command of this.commands.filter(commandItem => commandItem.type === 'text') as Array<Command.Text>) {
					const matchedAlias = [ command.name, ...command.aliases ].find(
						alias => command.argTypes.length === 0
						 ? message.content === `${this.prefix}${alias}`
						 : message.content.startsWith(`${this.prefix}${alias} `),
					)
					if (matchedAlias !== undefined) {
						const textCommandCtx = new Ctx.Text({ bot: this, command, matchedAlias, message })
						command.callback(textCommandCtx)
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
						for (const command of this.commands.filter(commandItem => commandItem.type === 'slash') as Array<Command.Slash>) {
							if ([ command.name, ...command.aliases ].includes(interaction.commandName)) {
								command.callback(new Ctx.Slash({ bot: this, command, interaction }))
								break
							}
						}
					} else {
						for (const command of this.commands.filter(commandItem => commandItem.type === 'slash') as Array<Command.Slash>) {
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
			this._eventWaiters = {}
			this.cachedMessages = new WeakReadonlyArray(
				...this.client.guilds.cache
					.reduce<Array<Message>>(
						(p, c) => p.concat(
							(c.channels.cache.filter(channel => channel.isText()) as Collection<Snowflake, TextBasedChannels>)
								.reduce<Array<Message>>(
									(_p, _c) => _p.concat([ ..._c.messages.cache.values() ]),
									[],
								),
						),
						[],
					),
			)
			this.commands ??= []
			this.channels = []
			this.emojis = []
			this.guilds = []
			this.ownerId = option.ownerId ?? null
			this.prefix = option.prefix ?? ''
			this.privateChannels = []
			this.users = []
		}
	}
	// #region decorator
	public static button(option: ButtonListenerOption = {}) {
		return (bot: Bot, listenerName: string): void => {
			const listener = bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void
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
	public static event(eventName: keyof BotEvents): (bot: Bot, listenerName: string) => void
	public static event(bot: Bot, listenerName: BotEventListenerMethodName): void
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static event(first: keyof BotEvents | Bot, listenerName?: BotEventListenerMethodName): ((bot: Bot, listenerName: string) => void) | void {
		if (listenerName === undefined) {
			const eventName = first as keyof BotEvents
			return (bot: Bot, _listenerName: string): void => {
				bot.addListener((bot[_listenerName as keyof typeof bot] as (...args: Array<any>) => void).bind(bot), eventName)
			}
		} else {
			const bot = first as Bot
			if (!listenerName.startsWith('on')) {
				throw new Error('name of listener is not starting with \'on\'')
			} else {
				const eventName = listenerName.replace(/^on([A-Z])/, (_, $1: string) => $1.toLowerCase()) as keyof BotEvents
				bot.addListener((bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void).bind(bot), eventName)
			}
		}
	}
	public static selectMenu(option: SelectMenuListenerOption = {}) {
		return (bot: Bot, listenerName: string): void => {
			const listener = bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void
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
	public static slashCommand(option: Partial<Omit<SlashCommandInitOption, 'callback'>> = {}) {
		return (bot: Bot, listenerName: string): void => {
			bot.addCommand(
				new Command.Slash({
					name: option.name ?? listenerName,
					aliases: option.aliases,
					description: option.description,
					argDefinitions: option.argDefinitions,
					noSubCommand: option.noSubCommand,
					callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void).bind(bot),
				}),
			)
		}
	}
	public static subSlashCommand(option: WeakRequired<Partial<Omit<SubSlashCommandInitOption, 'callback'>>, 'for'>) {
		return (bot: Bot, listenerName: string): void => {
			if (option.for === undefined) {
				throw new Error('for is required option.')
			} else {
				const foundCommand = (bot.commands.filter(command => command.type === 'slash') as Array<Command.Slash>).find(command => [ command.name, ...command.aliases ].includes(option.for))
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
							callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void).bind(bot),
						}),
					)
				}
			}
		}
	}
	public static textCommand(option: Partial<Omit<TextCommandInitOption, 'callback'>> = {}) {
		return (bot: Bot, listenerName: string): void => {
			bot.addCommand(
				new Command.Text({
					name: option.name ?? listenerName,
					aliases: option.aliases,
					argTypes: option.argTypes,
					callback: (bot[listenerName as keyof typeof bot] as (...args: Array<any>) => void).bind(bot),
				}),
			)
		}
	}
	// #endregion decorator
	public get activities(): Array<ActivitiesOptions> | undefined {
		return this.client.options.presence?.activities?.map(activity => ({ ...activity }))
	}
	public get allowedMentions(): MessageMentionOptions | undefined {
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
	public get intents(): Array<IntentFlags> {
		return [ ...this._clientOption.intents ]
	}
	public get latency(): number {
		return this.client.ws.ping
	}
	public get user(): User | null {
		return this.client.user
	}
	public absorbCommands(bot: typeof Bot): void {
		if (!(bot?.prototype instanceof Bot)) {
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
						}),
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
								}),
							)
						}
					}
					this.addCommand(createdCommand)
				}
			}
		}
	}
	public async absorbCommandsByPath(path: string): Promise<void> {
		let imported
		try {
			imported = await import($path.isAbsolute(path) ? path : $path.join(process.cwd(), path)) as { default: typeof Bot; }
		} catch (error) {
			if ((error as { code: string; }).code === 'MODULE_NOT_FOUND') {
				throw new Error(`no file found with path '${path}'`)
			} else {
				throw error
			}
		}
		if (imported?.default === undefined) {
			throw new TypeError('source file is not exporting class Bot')
		} else {
			this.absorbCommands(imported.default)
		}
	}
	public absorbCommandsSyncByPath(path: string): void {
		let imported
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			imported = require($path.isAbsolute(path) ? path : $path.join(process.cwd(), path)) as { default: typeof Bot; }
		} catch (error) {
			if ((error as { code: string; }).code === 'MODULE_NOT_FOUND') {
				throw new Error(`no file found with path '${path}'`)
			} else {
				throw error
			}
		}
		if (imported?.default === undefined) {
			throw new TypeError('source file is not exporting class Bot')
		} else {
			this.absorbCommands(imported.default)
		}
	}
	public addCommand(command: Command.Text | Command.Slash): void {
		if (!(command instanceof Command.Text) && !(command instanceof Command.Slash)) {
			throw new TypeError('type of command is not TextCommand or SlashCommand')
		} else {
			this.commands ??= []
			this.commands.push(command)
		}
	}
	public async changePresence(option: Omit<PresenceData, 'shardId'>): Promise<void> {
		if (!this.isReady()) {
			throw new Error('client is not readied')
		} else {
			this.client.user.setPresence(option)
		}
	}
	public async createGuild(name: string, option: { region?: string; icon?: string; code?: string; }): Promise<Guild> {
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
	public async deleteInvite(invite: Invite): Promise<void> {
		await invite.delete()
	}
	public async fetchApplicationInfo(): Promise<ClientApplication | null> {
		return await this.client.application?.fetch() ?? null
	}
	public isOwner(user: User): boolean {
		return this.ownerId === user.id
	}
	public isReady(): this is this & { client: Client<true>; } {
		return this.client.readyAt !== null
	}
	public async run(token: string): Promise<void> {
		if (typeof token !== 'string') {
			throw new TypeError('type of token is not string')
		} else {
			await this.client.login(token)
		}
	}
	public waitFor<K extends keyof BotEvents>(eventName: K, option: {
		check?: (...args: BotEvents[K]) => boolean
		timeout?: number
	} = {}): Promise<BotEvents[K]> {
		return new Promise((resolve, reject) => {
			if (!BOT_EVENT_NAMES.includes(eventName)) {
				reject(new Error(`invalid event name: ${eventName}`))
			} else if (typeof option !== 'object' || option === null) {
				throw new TypeError('type of option is not object')
			} else if (option.check !== undefined && typeof option.check !== 'function') {
				throw new TypeError('type of option.check is not function')
			} else if (option.timeout !== undefined && typeof option.timeout !== 'number') {
				throw new TypeError('type of option.timeout is not number')
			} else {
				const waiter = {
					check: option.check,
					resolve: (..._: BotEvents[K]): void => {},
				}
				this._eventWaiters[eventName] ??= []
				const nonUndefinedEventWaiters = this._eventWaiters[eventName]!
				nonUndefinedEventWaiters.push(waiter)
				if (option.timeout !== undefined) {
					const timeout = setTimeout(() => {
						nonUndefinedEventWaiters.splice(nonUndefinedEventWaiters.indexOf(waiter), 1)
						reject(new Error('timed out'))
					}, option.timeout)
					waiter.resolve = (...args: BotEvents[K]): void => {
						clearTimeout(timeout)
						resolve(args)
					}
				} else {
					waiter.resolve = (...args: BotEvents[K]): void => {
						resolve(args)
					}
				}
				const listener = (...args: BotEvents[K]): void => {
					if (waiter.check !== undefined) {
						if (waiter.check(...args)) {
							waiter.resolve(...args)
						}
					} else {
						waiter.resolve(...args)
					}
				}
				this.addListener((...args) => {
					this.removeListener(listener, eventName)
					listener(...args)
				}, eventName)
			}
		})
	}
}
