import type { ApplicationCommandData } from 'discord.js';
import BaseSlash from './BaseSlash';
import type { BaseSlashCommandInitOption } from './BaseSlash';
import SubSlash from './SubSlash';
import type * as Ctx from '../Ctx';
export interface SlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.Slash> {
    readonly noSubCommand: boolean | undefined;
}
export default class Slash extends BaseSlash<Ctx.Slash> {
    readonly noSubCommand: boolean;
    readonly subCommands: Array<SubSlash>;
    readonly type: "slash";
    constructor(option: SlashCommandInitOption);
    addSubCommand(subCommand: SubSlash): void;
    toRawArray(): Array<ApplicationCommandData>;
}
