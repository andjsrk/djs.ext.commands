import type { ApplicationCommandData, ApplicationCommandSubCommandData } from 'discord.js';
import Base from './Base';
import type { BaseCommandInitOption } from './Base';
import type BaseSlashCtx from '../Ctx/BaseSlash';
import type { OptionalSlashArgType, PureSlashArgType } from '../Ctx/BaseSlash';
export interface SlashArg<T extends PureSlashArgType | OptionalSlashArgType> {
    type: T;
    name: string;
    description?: string;
}
export declare type SlashArgList = Array<SlashArg<PureSlashArgType>> | [...Array<SlashArg<PureSlashArgType>>, ...Array<SlashArg<OptionalSlashArgType>>];
export interface BaseSlashCommandInitOption<T extends BaseSlashCtx> extends BaseCommandInitOption {
    readonly description: string | undefined;
    readonly argDefinitions: SlashArgList | undefined;
    readonly callback: (ctx: T) => void;
}
export default abstract class BaseSlash<T extends BaseSlashCtx> extends Base {
    readonly argDefinitions: SlashArgList;
    callback: (ctx: T) => void;
    readonly description: string | undefined;
    constructor(option: BaseSlashCommandInitOption<T>);
    abstract toRawArray(): Array<ApplicationCommandData | ApplicationCommandSubCommandData>;
}
