import BaseSlash from './BaseSlash'
import type { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash'
import type SlashCommand from '../Command/Slash'
import type SubSlashCommand from '../Command/SubSlash'

export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
	readonly mainCommand: SlashCommand
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class SubSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
	public override readonly command: SubSlashCommand
	public readonly group: string | null
	public readonly mainCommand: SlashCommand
	public override readonly name: string
	public override readonly type
	constructor(option: SlashCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		const { mainCommand } = option
		const commandName = this.interaction.options.getSubcommand()
		this.command = mainCommand.subCommands.find(subCommand => [ subCommand.name, ...subCommand.aliases ].includes(commandName))!
		this.mainCommand = mainCommand
		this.group = this.interaction.options.getSubcommandGroup(false)
		this.name = commandName
		this.type = 'subSlash'
	}
}
