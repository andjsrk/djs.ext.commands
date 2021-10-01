import { ButtonInteraction } from 'discord.js';
import ComponentInteraction, { ComponentInteractionCtxInitOption } from './ComponentInteraction';
export interface ButtonCtxInitOption extends ComponentInteractionCtxInitOption {
}
export default class Button extends ComponentInteraction {
    readonly interaction: ButtonInteraction;
    constructor(option: ButtonCtxInitOption);
    readonly type = "button";
}
