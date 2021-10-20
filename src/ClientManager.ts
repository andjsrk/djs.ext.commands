import { Client } from 'discord.js'
import { IntentFlags } from './Intents'

export interface ClientOption {
	intents: Array<IntentFlags>
}

export interface ClientManagerInitOption {
	readonly intents?: Array<IntentFlags>
}
export default class ClientManager {
	protected readonly _clientOption: ClientOption
	public readonly client: Client
	constructor(option: ClientManagerInitOption) {
		const clientOption: ClientOption = {
			intents: [ IntentFlags.GUILDS, IntentFlags.GUILD_MESSAGES ],
		}
		if (option.intents !== undefined) {
			clientOption.intents = option.intents
		}
		this.client = new Client(clientOption)
		this._clientOption = clientOption
	}
}
