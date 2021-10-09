import {
	MessageComponentInteraction, CommandInteraction, Guild, GuildMember, Message, MessageEmbed, User,
	InteractionReplyOptions, TextBasedChannels,
} from 'discord.js'
import Base, { BaseCtxInitOption, MessageSendOption } from './Base'

export interface InteractionCtxInitOption extends BaseCtxInitOption {
	readonly interaction: MessageComponentInteraction | CommandInteraction
}
export default abstract class Interaction extends Base {
	public readonly interaction: MessageComponentInteraction | CommandInteraction
	public readonly guild: Guild | null
	public readonly channel: TextBasedChannels
	public readonly user: GuildMember | User
	constructor(option: InteractionCtxInitOption) {
		super({ bot: option.bot })
		this.interaction = option.interaction
		this.guild = this.interaction.guild
		this.channel = this.interaction.channel!
		this.user = (this.interaction.member as GuildMember | null) ?? this.interaction.user
	}
	public abstract readonly type: string
	public override async send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>
	public override async send(option: InteractionReplyOptions & MessageSendOption): Promise<Message>
	public override async send(content: string | MessageEmbed | (InteractionReplyOptions & MessageSendOption), option: MessageSendOption = {}) {
		const dSendOption =
			typeof content === 'string'
			 ? { content }
			 : content instanceof MessageEmbed
			  ? { embeds: [ content ] }
			  : typeof content === 'object' && content !== null
			   ? content
			   : (() => { throw new TypeError('invalid type') })()
		const sendOption =
			typeof content === 'string' || content instanceof MessageEmbed
			 ? option
			 : typeof content === 'object' && content !== null
			  ? content
			  : (() => { throw new TypeError('invalid type') })()
		const reply = await this.interaction.reply({ ...dSendOption, fetchReply: true })
		const sentReply = this.interaction.channel?.messages.cache.get(reply.id)
		if (sentReply !== undefined) {
			if (sendOption.deleteAfter !== undefined) {
				setTimeout(() => {
					if (sentReply.deletable) {
						sentReply.delete()
					}
				}, sendOption.deleteAfter)
			}
		}
		return sentReply
	}
}
