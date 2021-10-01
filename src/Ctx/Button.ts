import { ButtonInteraction } from 'discord.js'
import ComponentInteraction, { ComponentInteractionCtxInitOption } from './ComponentInteraction'

export interface ButtonCtxInitOption extends ComponentInteractionCtxInitOption {}
export default class Button extends ComponentInteraction {
	public override readonly interaction: ButtonInteraction
	constructor(option: ButtonCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.interaction = option.interaction as ButtonInteraction
	}
	public override readonly type = 'button'
}
