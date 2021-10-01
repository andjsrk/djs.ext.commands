import { MessageComponentInteraction } from 'discord.js';
import Interaction, { InteractionCtxInitOption } from './Interaction';
export interface ComponentInteractionCtxInitOption extends InteractionCtxInitOption {
    readonly interaction: MessageComponentInteraction;
}
export default abstract class ComponentInteraction extends Interaction {
    abstract readonly interaction: MessageComponentInteraction;
    readonly customId: string;
    constructor(option: ComponentInteractionCtxInitOption);
    abstract readonly type: string;
}
