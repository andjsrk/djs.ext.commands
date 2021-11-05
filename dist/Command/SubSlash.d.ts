import type { ApplicationCommandSubCommandData } from 'discord.js';
import BaseSlash from './BaseSlash';
import type { BaseSlashCommandInitOption } from './BaseSlash';
import type Slash from './Slash';
import type * as Ctx from '../Ctx';
export interface SubSlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.SubSlash> {
    readonly for: string;
    readonly mainCommand: Slash;
}
export default class SubSlash extends BaseSlash<Ctx.SubSlash> {
    readonly for: string;
    readonly mainCommand: Slash;
    readonly type: "subSlash";
    constructor(option: SubSlashCommandInitOption);
    toRawArray(): Array<ApplicationCommandSubCommandData>;
}
