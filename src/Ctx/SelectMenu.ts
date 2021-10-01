import { SelectMenuInteraction } from 'discord.js'
import ComponentInteraction, { ComponentInteractionCtxInitOption } from './ComponentInteraction'

export interface SelectMenuCtxInitOption extends ComponentInteractionCtxInitOption {}
export default class SelectMenu extends ComponentInteraction {
	public override readonly interaction: SelectMenuInteraction
	public readonly selected: Array<string>
	constructor(option: SelectMenuCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.interaction = option.interaction as SelectMenuInteraction
		this.selected = [ ...this.interaction.values ]
	}
	public override readonly type = 'selectMenu'
}
