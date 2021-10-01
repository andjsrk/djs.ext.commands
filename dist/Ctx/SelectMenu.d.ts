import { SelectMenuInteraction } from 'discord.js';
import ComponentInteraction, { ComponentInteractionCtxInitOption } from './ComponentInteraction';
export interface SelectMenuCtxInitOption extends ComponentInteractionCtxInitOption {
}
export default class SelectMenu extends ComponentInteraction {
    readonly interaction: SelectMenuInteraction;
    readonly selected: Array<string>;
    constructor(option: SelectMenuCtxInitOption);
    readonly type = "selectMenu";
}
