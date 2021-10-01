import BaseSlash, { BaseSlashCtxInitOption, SlashArgTypeList } from './BaseSlash';
import SlashCommand from '../Command/Slash';
export interface SlashCtxInitOption extends BaseSlashCtxInitOption {
    readonly command: SlashCommand;
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default class Slash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends BaseSlash<ArgTypeList> {
    readonly command: SlashCommand;
    constructor(option: SlashCtxInitOption);
    readonly type = "slash";
}
