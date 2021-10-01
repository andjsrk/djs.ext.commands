import { ClientEvents } from 'discord.js'
import ClientManager from './ClientManager'
import * as Ctx from './Ctx'
import { IntentFlags } from './Intents'

export const CLIENT_EVENT_NAMES: Array<keyof ClientEvents> = [ 'messageCreate', 'messageUpdate', 'messageDelete', 'interactionCreate', 'ready' ]
export const PURE_BOT_EVENT_NAMES: Array<keyof PureBotEvents> = [
	'buttonPress', 'selectMenuSelect',
]
export const BOT_EVENT_NAMES: Array<keyof BotEvents> = [
	...CLIENT_EVENT_NAMES,
	...PURE_BOT_EVENT_NAMES
]

export interface PureBotEvents {
	buttonPress: [ ctx: Ctx.Button ]
	selectMenuSelect: [ ctx: Ctx.SelectMenu ]
}
export type BotEvents = PureBotEvents & ClientEvents
export type BotEventListenerMethodName<T extends keyof ClientEvents = keyof ClientEvents> = `on${Capitalize<T>}`

export interface BotEventManagerInitOption {
	readonly intents?: Array<IntentFlags>
}
export default abstract class BotEventManager extends ClientManager {
	protected _eventListeners: Partial<{ [K in keyof BotEvents]: Array<(...args: BotEvents[K]) => any> }>
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
							(listener as (...args: ClientEvents[keyof ClientEvents]) => any)(...args)
						}
					}
				}, guardedEventName)
			}
		}
	}
	public addRawListener<K extends keyof ClientEvents>(listener: ((...args: ClientEvents[K]) => any) & { name: K }): void
	public addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => any, eventName: K): void
	public addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => any, eventName?: K) {
		if (typeof listener !== 'function') {
			throw new TypeError('type of listener is not function')
		} else {
			eventName ??= listener.name as K
			this.client.on(eventName, listener)
		}
	}
	public addListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => any) & { name: K }): void
	public addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => any, eventName: K): void
	public addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => any, eventName?: K) {
		if (typeof listener !== 'function') {
			throw new TypeError('type of listener is not function')
		} else {
			eventName ??= listener.name as K
			if (!BOT_EVENT_NAMES.includes(eventName)) {
				throw new Error(`invalid event name: ${eventName}`)
			} else {
				this._eventListeners ??= {}
				this._eventListeners[eventName] ??= []
				this._eventListeners[eventName]!.push(listener as (...args: Array<any>) => any)
			}
		}
	}
}
