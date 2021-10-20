import type { ClientEvents } from 'discord.js'
import ClientManager from './ClientManager'
import type * as Ctx from './Ctx'
import type { IntentFlags } from './Intents'

/* eslint-disable array-element-newline */
export const CLIENT_EVENT_NAMES: Array<keyof ClientEvents> = [
	'debug', 'error', 'warn', 'ready', 'rateLimit', 'invalidRequestWarning', 'invalidated',
	'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate',
	'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate',
	'emojiCreate', 'emojiDelete', 'emojiUpdate',
	'guildBanAdd', 'guildBanRemove',
	'guildCreate', 'guildDelete', 'guildUpdate',
	'guildIntegrationsUpdate',
	'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMemberUpdate', 'guildMembersChunk',
	'guildUnavailable',
	'interactionCreate',
	'inviteCreate', 'inviteDelete',
	'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageUpdate',
	'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',
	'presenceUpdate',
	'roleCreate', 'roleDelete', 'roleUpdate',
	'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume',
	'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate',
	'stickerCreate', 'stickerDelete', 'stickerUpdate',
	'threadCreate', 'threadDelete', 'threadListSync', 'threadMemberUpdate', 'threadMembersUpdate', 'threadUpdate',
	'typingStart',
	'userUpdate',
	'voiceStateUpdate',
	'webhookUpdate',
]
/* eslint-enable array-element-newline */
export interface PureBotEvents {
	buttonPress: [ ctx: Ctx.Button ]
	selectMenuSelect: [ ctx: Ctx.SelectMenu ]
}
export type BotEvents = PureBotEvents & ClientEvents
export const PURE_BOT_EVENT_NAMES: Array<keyof PureBotEvents> = [
	'buttonPress', 'selectMenuSelect',
]
export const BOT_EVENT_NAMES: Array<keyof BotEvents> = [
	...CLIENT_EVENT_NAMES,
	...PURE_BOT_EVENT_NAMES,
]
export type BotEventListenerMethodName<T extends keyof ClientEvents = keyof ClientEvents> = `on${Capitalize<T>}`

export interface BotEventManagerInitOption {
	readonly intents?: Array<IntentFlags>
}
export default abstract class BotEventManager extends ClientManager {
	protected _eventListeners: Partial<{ [K in keyof BotEvents]: Array<(...args: BotEvents[K]) => void> }>
	constructor(option: BotEventManagerInitOption) {
		super({ intents: option.intents })
		this._eventListeners ??= {}
		for (const eventName of BOT_EVENT_NAMES) {
			if (CLIENT_EVENT_NAMES.includes(eventName as keyof ClientEvents)) {
				const guardedEventName = eventName as keyof ClientEvents & keyof BotEvents
				this.addRawListener((...args) => {
					const listeners = this._eventListeners[guardedEventName]
					if (listeners !== undefined) {
						for (const listener of listeners) {
							(listener as (..._args: ClientEvents[keyof ClientEvents]) => void)(...args)
						}
					}
				}, guardedEventName)
			}
		}
	}
	public addListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => void) & { name: K; }): void
	public addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName: K): void
	public addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName?: K): void {
		if (typeof listener !== 'function') {
			throw new TypeError('type of listener is not function')
		} else {
			const realEventName = eventName ?? listener.name as K
			if (!BOT_EVENT_NAMES.includes(realEventName)) {
				throw new Error(`invalid event name: ${realEventName}`)
			} else {
				this._eventListeners ??= {}
				this._eventListeners[realEventName] ??= []
				this._eventListeners[realEventName]!.push(listener as (...args: Array<any>) => void)
			}
		}
	}
	public addRawListener<K extends keyof ClientEvents>(listener: ((...args: ClientEvents[K]) => void) & { name: K; }): void
	public addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => void, eventName: K): void
	public addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => void, eventName?: K): void {
		if (typeof listener !== 'function') {
			throw new TypeError('type of listener is not function')
		} else {
			this.client.on(eventName ?? listener.name as K, listener)
		}
	}
	public removeListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => void) & { name: K; }): void
	public removeListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName: K): void
	public removeListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName?: K): void {
		if (typeof listener !== 'function') {
			throw new TypeError('type of listener is not function')
		} else {
			const realEventName = eventName ?? listener.name as K
			if (!BOT_EVENT_NAMES.includes(realEventName)) {
				throw new Error(`invalid event name: ${realEventName}`)
			} else {
				const foundIndex = (this._eventListeners[realEventName] ?? [] as Array<(...args: BotEvents[K]) => void>).indexOf(listener)
				if (foundIndex !== -1) {
					this._eventListeners[realEventName]!.splice(foundIndex, 1)
				}
			}
		}
	}
}
