import type { MessageComponentInteraction } from 'discord.js'
import Interaction from './Interaction'
import type { InteractionCtxInitOption } from './Interaction'

export interface ComponentInteractionCtxInitOption<T extends MessageComponentInteraction> extends InteractionCtxInitOption<T> {}
export default abstract class ComponentInteraction<T extends MessageComponentInteraction> extends Interaction<T> {
	public readonly customId: string
	constructor(option: ComponentInteractionCtxInitOption<T>) {
		super({ bot: option.bot, interaction: option.interaction })
		this.customId = option.interaction.customId
	}
}
