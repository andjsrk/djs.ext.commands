import BaseSlash, { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash'
import SlashCommand from '../Command/Slash'

export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
	readonly command: SlashCommand
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class Slash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
	public override readonly command: SlashCommand
	constructor(option: SlashCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.command = option.command
	}
	public override readonly type = 'slash'
}
