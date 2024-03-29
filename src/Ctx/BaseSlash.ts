import { GuildMember, Role, User } from 'discord.js'
import type { CommandInteraction, CommandInteractionOptionResolver, GuildChannel } from 'discord.js'
import Interaction from './Interaction'
import type { InteractionCtxInitOption } from './Interaction'
import type SlashCommand from '../Command/Slash'
import type SubSlashCommand from '../Command/SubSlash'

export type PureSlashArgType =
	| 'string'
	| 'number'
	| 'integer'
	| 'boolean'
	| 'user'
	| 'role'
	| 'mentionable'
	| 'channel'
export type OptionalSlashArgType = `${PureSlashArgType}?`
export type SlashArgType = PureSlashArgType | OptionalSlashArgType
export type SlashArgTypeList = ReadonlyArray<PureSlashArgType> | readonly [ ...ReadonlyArray<PureSlashArgType>, ...ReadonlyArray<OptionalSlashArgType> ]

export type ParsedSlashArgType<T extends PureSlashArgType> =
	T extends 'string'
	 ? string
	 : T extends 'number' | 'integer'
	  ? number
	  : T extends 'boolean'
	   ? boolean
	   : T extends 'user'
	    ? User
	    : T extends 'role'
	     ? Role
	     : T extends 'mentionable'
	      ? GuildMember | Role
	      : T extends 'channel'
	       ? GuildChannel
	       : never
export type ParsedSlashArgTypePiece<T extends SlashArgType> =
	T extends `${infer A}?`
	 ? A extends PureSlashArgType
	  ? ParsedSlashArgType<A> | null
	  : never
	 : T extends PureSlashArgType
	  ? ParsedSlashArgType<T>
	  : never
export type ParsedSlashArgTypeList<A extends SlashArgTypeList> =
	A extends []
	 ? []
	 : A extends [ infer B, ...infer C ]
	  ? B extends SlashArgType
	   ? C extends []
	    ? [ ParsedSlashArgTypePiece<B> ]
	    : C extends SlashArgTypeList
	     ? [ ParsedSlashArgTypePiece<B>, ...ParsedSlashArgTypeList<C> ]
	     : never
	   : never
	  : never

export interface BaseSlashCtxInitOption extends InteractionCtxInitOption<CommandInteraction> {}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default abstract class BaseSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends Interaction<CommandInteraction> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly args: ParsedSlashArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedSlashArgTypeList<ArgTypeList>
	public readonly command: SlashCommand | SubSlashCommand
	public readonly name: string
	public abstract override readonly type: string
	constructor(option: BaseSlashCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		const { commandName } = this.interaction
		this.command = this.bot.commands.find(command => command.type === 'slash' && [ command.name, ...command.aliases ].includes(commandName))! as SlashCommand
		this.name = commandName
		this.args = this._parseRaw(this.interaction.options)
	}
	protected _parseRaw(raw: CommandInteractionOptionResolver): ParsedSlashArgTypeList<ArgTypeList> {
		const args: Array<unknown | null> = []
		const argDefinitions = [ ...this.command.argDefinitions ]
		for (const argDefinition of argDefinitions) {
			const argName = argDefinition.name
			const pureArgType = argDefinition.type.replace(/\?$/, '') as PureSlashArgType
			switch (pureArgType) {
				case 'string':
					args.push(raw.getString(argName))
					break
				case 'number':
					args.push(raw.getNumber(argName))
					break
				case 'integer':
					args.push(raw.getInteger(argName))
					break
				case 'boolean':
					args.push(raw.getBoolean(argName))
					break
				case 'user':
					args.push(raw.getUser(argName))
					break
				case 'role':
					{
						let role = raw.getRole(argName)
						if (role !== null && this.bot.client.guilds.cache.get(this.interaction.guildId!)!.roles.cache.get(role.id) === undefined) {
							role = null
						}
						args.push(role as Role | null)
					}
					break
				case 'mentionable':
					{
						let mentionable = raw.getMentionable(argName)
						if (mentionable !== null && !(mentionable instanceof User) && !(mentionable instanceof Role) && !(mentionable instanceof GuildMember)) {
							mentionable = null
						}
						args.push(mentionable as Role | GuildMember | null)
					}
					break
				case 'channel':
					{
						let channel = raw.getChannel(argName)
						if (channel !== null && this.bot.client.channels.cache.get(channel.id) === undefined) {
							channel = null
						}
						args.push(channel as GuildChannel | null)
					}
					break
			}
		}
		return args as ParsedSlashArgTypeList<ArgTypeList>
	}
}
