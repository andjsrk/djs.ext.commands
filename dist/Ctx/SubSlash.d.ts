import BaseSlash from './BaseSlash';
import type { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash';
import type SlashCommand from '../Command/Slash';
import type SubSlashCommand from '../Command/SubSlash';
export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
    readonly mainCommand: SlashCommand;
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class SubSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
    readonly command: SubSlashCommand;
    readonly group: string | null;
    readonly mainCommand: SlashCommand;
    readonly name: string;
    readonly type: string;
    constructor(option: SlashCtxInitOption);
}
