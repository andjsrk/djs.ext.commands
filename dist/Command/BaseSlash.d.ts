import { ApplicationCommandData, ApplicationCommandSubCommandData } from 'discord.js';
import Base, { BaseCommandInitOption } from './Base';
import BaseSlashCtx from '../Ctx/BaseSlash';
import { PureSlashArgType, OptionalSlashArgType } from '../Ctx/BaseSlash';
export declare type SlashArg<T extends PureSlashArgType | OptionalSlashArgType> = {
    name: string;
    description?: string;
    type: T;
};
export declare type SlashArgList = Array<SlashArg<PureSlashArgType>> | [...Array<SlashArg<PureSlashArgType>>, ...Array<SlashArg<OptionalSlashArgType>>];
export interface BaseSlashCommandInitOption<T extends BaseSlashCtx> extends BaseCommandInitOption {
    readonly description: string | undefined;
    readonly argDefinitions: SlashArgList | undefined;
    readonly callback: (ctx: T) => any;
}
export default abstract class BaseSlash<T extends BaseSlashCtx> extends Base {
    readonly description: string | undefined;
    readonly argDefinitions: SlashArgList;
    callback: (ctx: T) => any;
    constructor(option: BaseSlashCommandInitOption<T>);
    abstract readonly type: string;
    abstract toRawArray(): Array<ApplicationCommandData | ApplicationCommandSubCommandData>;
}
