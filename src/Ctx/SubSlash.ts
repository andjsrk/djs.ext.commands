import BaseSlash, { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash'
import SlashCommand from '../Command/Slash'
import SubSlashCommand from '../Command/SubSlash'

export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
	readonly mainCommand: SlashCommand
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class SubSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
	public readonly mainCommand: SlashCommand
	public override readonly command: SubSlashCommand
	public readonly group: string | null
	public override readonly name: string
	constructor(option: SlashCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.mainCommand = option.mainCommand
		const commandName = this.interaction.options.getSubcommand()
		this.command = this.mainCommand.subCommands.find(subCommand => [ subCommand.name, ...subCommand.aliases ].includes(commandName))!
		this.group = this.interaction.options.getSubcommandGroup(false)
		this.name = commandName
	}
	public override readonly type = 'subSlash'
}
