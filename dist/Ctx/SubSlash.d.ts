import BaseSlash, { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash';
import SlashCommand from '../Command/Slash';
import SubSlashCommand from '../Command/SubSlash';
export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
    readonly mainCommand: SlashCommand;
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class SubSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
    readonly mainCommand: SlashCommand;
    readonly command: SubSlashCommand;
    readonly group: string | null;
    readonly name: string;
    constructor(option: SlashCtxInitOption);
    readonly type = "subSlash";
}
