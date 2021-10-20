import { MessageEmbed } from 'discord.js'
import type { CommandInteraction, Guild, GuildMember, Message, MessageComponentInteraction, User } from 'discord.js'
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import type { InteractionReplyOptions, TextBasedChannels } from 'discord.js'
import Base from './Base'
import type { BaseCtxInitOption, MessageSendOption } from './Base'

export interface InteractionCtxInitOption<T extends CommandInteraction | MessageComponentInteraction> extends BaseCtxInitOption {
	readonly interaction: T
}
export default abstract class Interaction<T extends CommandInteraction | MessageComponentInteraction> extends Base {
	public readonly channel: TextBasedChannels
	public readonly guild: Guild | null
	public readonly interaction: T
	public override readonly user: GuildMember | User
	constructor(option: InteractionCtxInitOption<T>) {
		super({ bot: option.bot })
		const { interaction } = option
		this.channel = interaction.channel!
		this.guild = interaction.guild
		this.interaction = interaction
		this.user = (interaction.member as GuildMember | null) ?? interaction.user
	}
	public override async send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message | undefined>
	public override async send(option: InteractionReplyOptions & MessageSendOption): Promise<Message | undefined>
	public override async send(content: string | MessageEmbed | (InteractionReplyOptions & MessageSendOption), option: MessageSendOption = {}): Promise<Message | undefined> {
		const dSendOption =
			typeof content === 'string'
			 ? { content }
			 : content instanceof MessageEmbed
			  ? { embeds: [ content ] }
			  : typeof content === 'object' && content !== null
			   ? content
			   : ((): never => { throw new TypeError('invalid type') })()
		const sendOption =
			typeof content === 'string' || content instanceof MessageEmbed
			 ? option
			 : typeof content === 'object' && content !== null
			  ? content
			  : ((): never => { throw new TypeError('invalid type') })()
		const reply = await this.interaction.reply({ ...dSendOption, fetchReply: true })
		const sentReply = this.interaction.channel?.messages.cache.get(reply.id)
		if (sentReply !== undefined) {
			if (sendOption.deleteAfter !== undefined) {
				setTimeout(async () => {
					if (sentReply.deletable) {
						await sentReply.delete()
					}
				}, sendOption.deleteAfter)
			}
		}
		return sentReply
	}
}
