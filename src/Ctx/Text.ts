import {
	Guild, GuildMember, Message, MessageEmbed, Role, TextChannel, User, VoiceChannel,
	MessageOptions, TextBasedChannels,
} from 'discord.js'
import Base, { BaseCtxInitOption, MessageSendOption } from './Base'
import TextCommand from '../Command/Text'

export type PureTextArgType =
	 | 'string'
	 | 'number'
	 | 'integer'
	 | 'naturalNumber'
	 | 'decimal'
	 | 'boolean'
	 | 'user'
	 | 'member'
	 | 'role'
	 | 'channel'
	 | 'textChannel'
	 | 'voiceChannel'
export type RestTextArgType = `...${PureTextArgType}`
export type TextArgTypeList = ReadonlyArray<PureTextArgType> | readonly [ ...ReadonlyArray<PureTextArgType>, RestTextArgType ]

export type ParsedTextArgTypePiece<T extends PureTextArgType> =
	T extends 'string'
	 ? string
	 : T extends 'number' | 'integer' | 'naturalNumber' | 'decimal'
	  ? number
	  : T extends 'boolean'
	   ? boolean
	   : T extends 'user'
	    ? User
		: T extends 'member'
		 ? GuildMember
		 : T extends 'role'
		  ? Role
		  : T extends 'channel'
		   ? TextChannel | VoiceChannel
		   : T extends 'textChannel'
		    ? TextChannel
			: T extends 'voiceChannel'
			 ? VoiceChannel
			 : never
export type ParsedTextArgTypeList<A extends TextArgTypeList> =
	A extends []
	 ? []
	 : A extends [ infer B, ...infer C ]
	  ? C extends Array<any>
	   ? B extends `...${infer T}`
	    ? T extends PureTextArgType
	     ? [ Array<ParsedTextArgTypePiece<T>> ]
		 : never
	    : B extends PureTextArgType
	     ? C extends []
		  ? [ ParsedTextArgTypePiece<B> ]
		  : [ ParsedTextArgTypePiece<B> | null, ...ParsedTextArgTypeList<C> ]
		 : never
	   : never
	  : never

export interface TextCtxInitOption extends BaseCtxInitOption {
	readonly message: Message
	readonly command: TextCommand
	readonly matchedAliase: string
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
	public readonly message: Message
	public readonly command: TextCommand
	public readonly args: ParsedTextArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedTextArgTypeList<ArgTypeList>
	public readonly channel: TextBasedChannels
	public readonly content: string
	public readonly guild: Guild | null
	public readonly matchedAliase: string
	public readonly me: GuildMember | User
	public readonly user: GuildMember | User
	constructor(option: TextCtxInitOption) {
		super({ bot: option.bot })
		this.message = option.message
		this.command = option.command
		this.args = this.parseRawToArgs(this.message.content) as ParsedTextArgTypeList<ArgTypeList>
		this.channel = this.message.channel
		this.content = this.message.content
		this.guild = this.message.guild
		this.matchedAliase = option.matchedAliase
		this.me = this.guild?.me ?? this.bot.client.user!
		this.user = this.message.member ?? this.message.author
	}
	protected parseRawToArgs(raw: string) {
		const args: Array<any> = []
		const rawArgs = raw.replace(`${this.bot.prefix}${this.matchedAliase}${0 < this.command.argTypes.length ? ' ' : ''}`, '').split(' ')
		const isPureArgType = (argType: PureTextArgType | RestTextArgType): argType is PureTextArgType => !argType.startsWith('...')
		for (const argType of this.command.argTypes) {
			if (isPureArgType(argType)) {
				const shifted = rawArgs.shift()
				if (shifted === undefined) {
					args.push(null)
				} else {
					args.push(this.parseOneArg(argType, shifted))
				}
			} else {
				const pureArgType = argType.replace('...', '') as PureTextArgType
				args.push(rawArgs.map(rawArg => this.parseOneArg(pureArgType, rawArg)))
				break
			}
		}
		return args
	}
	protected parseOneArg(argType: PureTextArgType, content: string) {
		if (argType === 'string') {
			return content
		} else {
			const regexp: Record<Exclude<PureTextArgType, 'string'>, RegExp> = {
				number: /^-?[0-9]+(?:\.[0-9]+)?$/,
				integer: /^-?[0-9]+$/,
				naturalNumber: /^[0-9]+$/,
				decimal: /^-?[0-9]+(?:\.[0-9]+)?$/,
				boolean: /^(?:t|T)rue|(?:f|F)alse$/,
				user: /^<@!([0-9]+)>$/,
				member: /^<@!([0-9]+)>$/,
				role: /^<@&([0-9]+)>$/,
				channel: /^<#([0-9]+)>$/,
				textChannel: /^<#([0-9]+)>$/,
				voiceChannel: /^<#([0-9]+)>$/,
			}
			const matched = content.match(regexp[argType])
			if (matched !== null && matched[0] !== undefined) {
				switch (argType) {
					case 'number':
						return Number(matched[0])
					case 'integer': case 'naturalNumber':
						return parseInt(matched[0], 10)
					case 'decimal':
						return parseFloat(matched[0])
					case 'boolean':
						return matched[0].toLowerCase() === 'true'
					case 'user':
						return this.bot.client.users.cache.get(matched[1]!) ?? null
					case 'member':
						return this.message.guild?.members.cache.get(matched[1]!) ?? null
					case 'role':
						return this.message.guild?.roles.cache.get(matched[1]!) ?? null
					case 'channel':
						return this.message.guild?.channels.cache.get(matched[1]!) ?? null
					case 'textChannel':
						return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').get(matched[1]!) ?? null
					case 'voiceChannel':
						return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').get(matched[1]!) ?? null
				}
			} else {
				return null
			}
		}
	}
	public async reply(content: string | MessageEmbed | MessageOptions) {
		let repliedMessage: Message
		if (typeof content === 'string') {
			repliedMessage = await this.message.reply({ content })
		} else if (content instanceof MessageEmbed) {
			repliedMessage = await this.message.reply({ embeds: [ content ] })
		} else {
			repliedMessage = await this.message.reply(content)
		}
		return repliedMessage
	}
	public override async send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>
	public override async send(option: MessageOptions & MessageSendOption): Promise<Message>
	public override async send(content: string | MessageEmbed | (MessageOptions & MessageSendOption), option: MessageSendOption = {}) {
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
			  : (() => { throw new TypeError() })()
		const sentMsg = await this.channel.send(dSendOption)
		if (sendOption.deleteAfter !== undefined) {
			setTimeout(() => {
				if (sentMsg.deletable) {
					sentMsg.delete()
				}
			}, sendOption.deleteAfter)
		}
		return sentMsg
	}
}
