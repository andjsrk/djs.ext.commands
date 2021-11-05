import type { ButtonInteraction } from 'discord.js';
import ComponentInteraction from './ComponentInteraction';
import type { ComponentInteractionCtxInitOption } from './ComponentInteraction';
export interface ButtonCtxInitOption extends ComponentInteractionCtxInitOption<ButtonInteraction> {
}
export default class Button extends ComponentInteraction<ButtonInteraction> {
    readonly type: string;
    constructor(option: ButtonCtxInitOption);
}
