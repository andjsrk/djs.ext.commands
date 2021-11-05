import type { SelectMenuInteraction } from 'discord.js';
import ComponentInteraction from './ComponentInteraction';
import type { ComponentInteractionCtxInitOption } from './ComponentInteraction';
export interface SelectMenuCtxInitOption extends ComponentInteractionCtxInitOption<SelectMenuInteraction> {
}
export default class SelectMenu extends ComponentInteraction<SelectMenuInteraction> {
    readonly selected: Array<string>;
    readonly type: string;
    constructor(option: SelectMenuCtxInitOption);
}
