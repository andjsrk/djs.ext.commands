import { Client, Message, MessageEmbed } from 'discord.js'
import Bot from '../Bot'

export interface MessageSendOption {
	deleteAfter?: number
}

export interface BaseCtxInitOption {
	readonly bot: Bot
}
export default abstract class Base {
	public readonly bot: Bot
	public readonly client: Client
	constructor(option: BaseCtxInitOption) {
		this.bot = option.bot
		this.client = this.bot.client
	}
	public abstract send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>
	public abstract send(option: MessageSendOption): Promise<Message>
}
