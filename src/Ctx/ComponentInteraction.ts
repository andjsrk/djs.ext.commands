import { MessageComponentInteraction } from 'discord.js'
import Interaction, { InteractionCtxInitOption } from './Interaction'

export interface ComponentInteractionCtxInitOption extends InteractionCtxInitOption {
	readonly interaction: MessageComponentInteraction
}
export default abstract class ComponentInteraction extends Interaction {
	public abstract override readonly interaction: MessageComponentInteraction
	public readonly customId: string
	constructor(option: ComponentInteractionCtxInitOption) {
		super({ bot: option.bot, interaction: option.interaction })
		this.customId = option.interaction.customId
	}
	abstract override readonly type: string
}
