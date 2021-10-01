import { ApplicationCommandData } from 'discord.js';
import BaseSlash, { BaseSlashCommandInitOption } from './BaseSlash';
import SubSlash from './SubSlash';
import * as Ctx from '../Ctx';
export interface SlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.Slash> {
    readonly noSubCommand: boolean | undefined;
}
export default class Slash extends BaseSlash<Ctx.Slash> {
    readonly noSubCommand: boolean;
    readonly subCommands: Array<SubSlash>;
    constructor(option: SlashCommandInitOption);
    readonly type = "slash";
    addSubCommand(subCommand: SubSlash): void;
    toRawArray(): Array<ApplicationCommandData>;
}
