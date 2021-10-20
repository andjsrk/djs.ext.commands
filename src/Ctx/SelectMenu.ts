import type { SelectMenuInteraction } from 'discord.js'
import ComponentInteraction from './ComponentInteraction'
import type { ComponentInteractionCtxInitOption } from './ComponentInteraction'

export interface SelectMenuCtxInitOption extends ComponentInteractionCtxInitOption<SelectMenuInteraction> {}
export default class SelectMenu extends ComponentInteraction<SelectMenuInteraction> {
	public readonly selected: Array<string>
	public override readonly type
	constructor(option: SelectMenuCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.selected = [ ...this.interaction.values ]
		this.type = 'selectMenu'
	}
}
