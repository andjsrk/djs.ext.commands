import { ApplicationCommandSubCommandData } from 'discord.js';
import BaseSlash, { BaseSlashCommandInitOption } from './BaseSlash';
import Slash from './Slash';
import * as Ctx from '../Ctx';
export interface SubSlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.SubSlash> {
    readonly for: string;
    readonly mainCommand: Slash;
}
export default class SubSlash extends BaseSlash<Ctx.SubSlash> {
    readonly for: string;
    readonly mainCommand: Slash;
    constructor(option: SubSlashCommandInitOption);
    readonly type = "subSlash";
    toRawArray(): Array<ApplicationCommandSubCommandData>;
}
