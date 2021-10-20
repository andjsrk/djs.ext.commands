import type { ButtonInteraction } from 'discord.js'
import ComponentInteraction from './ComponentInteraction'
import type { ComponentInteractionCtxInitOption } from './ComponentInteraction'

export interface ButtonCtxInitOption extends ComponentInteractionCtxInitOption<ButtonInteraction> {}
export default class Button extends ComponentInteraction<ButtonInteraction> {
	public override readonly type
	constructor(option: ButtonCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.type = 'button'
	}
}
