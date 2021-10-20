import type { Client, GuildMember, Message, MessageEmbed, User } from 'discord.js'
import type Bot from '../Bot'

export interface MessageSendOption {
	readonly deleteAfter?: number
}

export interface BaseCtxInitOption {
	readonly bot: Bot
}
export default abstract class Base {
	public readonly bot: Bot
	public readonly client: Client
	public abstract readonly type: string
	public abstract readonly user: GuildMember | User
	constructor(option: BaseCtxInitOption) {
		this.bot = option.bot
		this.client = this.bot.client
	}
	public abstract send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message | undefined>
	public abstract send(option: MessageSendOption): Promise<Message | undefined>
}
