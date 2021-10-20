import { MessageEmbed } from 'discord.js'
import type { Guild, GuildMember, Message, Role, TextChannel, User, VoiceChannel } from 'discord.js'
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import type { MessageOptions, TextBasedChannels } from 'discord.js'
import Base from './Base'
import type { BaseCtxInitOption, MessageSendOption } from './Base'
import type TextCommand from '../Command/Text'

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	readonly matchedAlias: string
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly args: ParsedTextArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedTextArgTypeList<ArgTypeList>
	public readonly channel: TextBasedChannels
	public readonly command: TextCommand
	public readonly content: string
	public readonly guild: Guild | null
	public readonly matchedAlias: string
	public readonly me: GuildMember | User
	public readonly message: Message
	public override readonly type
	public override readonly user: GuildMember | User
	constructor(option: TextCtxInitOption) {
		super({ bot: option.bot })
		const { message } = option
		this.args = this._parseRaw(message.content)
		this.channel = message.channel
		this.command = option.command
		this.content = message.content
		this.guild = message.guild
		this.matchedAlias = option.matchedAlias
		this.me = this.guild?.me ?? this.bot.client.user!
		this.message = message
		this.type = 'text'
		this.user = this.message.member ?? this.message.author
	}
	protected _parseOneRawArg(argType: PureTextArgType, content: string): ParsedTextArgTypePiece<PureTextArgType> | null {
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
			if (matched?.[0] !== undefined) {
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
						return this.message.guild?.channels.cache.get(matched[1]!) as TextChannel | VoiceChannel | undefined ?? null
					case 'textChannel':
						return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').get(matched[1]!) as TextChannel | undefined ?? null
					case 'voiceChannel':
						return this.message.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').get(matched[1]!) as VoiceChannel | undefined ?? null
					default:
						return null
				}
			} else {
				return null
			}
		}
	}
	protected _parseRaw(raw: string): ParsedTextArgTypeList<ArgTypeList> {
		const args: Array<unknown> = []
		const rawArgs = raw.replace(`${this.bot.prefix}${this.matchedAlias}${this.command.argTypes.length !== 0 ? ' ' : ''}`, '').split(' ')
		const isPureArgType = (argType: PureTextArgType | RestTextArgType): argType is PureTextArgType => !argType.startsWith('...')
		for (const argType of this.command.argTypes) {
			if (isPureArgType(argType)) {
				const shifted = rawArgs.shift()
				if (shifted === undefined) {
					args.push(null)
				} else {
					args.push(this._parseOneRawArg(argType, shifted))
				}
			} else {
				const pureArgType = argType.replace('...', '') as PureTextArgType
				args.push(rawArgs.map(rawArg => this._parseOneRawArg(pureArgType, rawArg)))
				break
			}
		}
		return args as ParsedTextArgTypeList<ArgTypeList>
	}
	public async reply(content: string | MessageEmbed | MessageOptions): Promise<Message> {
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
	public override async send(content: string | MessageEmbed | (MessageOptions & MessageSendOption), option: MessageSendOption = {}): Promise<Message> {
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
			  : ((): never => { throw new TypeError() })()
		const sentMsg = await this.channel.send(dSendOption)
		if (sendOption.deleteAfter !== undefined) {
			setTimeout(async () => {
				if (sentMsg.deletable) {
					await sentMsg.delete()
				}
			}, sendOption.deleteAfter)
		}
		return sentMsg
	}
}
