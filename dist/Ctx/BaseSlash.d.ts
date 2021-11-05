import { GuildMember, Role, User } from 'discord.js';
import type { CommandInteraction, CommandInteractionOptionResolver, GuildChannel } from 'discord.js';
import Interaction from './Interaction';
import type { InteractionCtxInitOption } from './Interaction';
import type SlashCommand from '../Command/Slash';
import type SubSlashCommand from '../Command/SubSlash';
export declare type PureSlashArgType = 'string' | 'number' | 'integer' | 'boolean' | 'user' | 'role' | 'mentionable' | 'channel';
export declare type OptionalSlashArgType = `${PureSlashArgType}?`;
export declare type SlashArgType = PureSlashArgType | OptionalSlashArgType;
export declare type SlashArgTypeList = ReadonlyArray<PureSlashArgType> | readonly [...ReadonlyArray<PureSlashArgType>, ...ReadonlyArray<OptionalSlashArgType>];
export declare type ParsedSlashArgType<T extends PureSlashArgType> = T extends 'string' ? string : T extends 'number' | 'integer' ? number : T extends 'boolean' ? boolean : T extends 'user' ? User : T extends 'role' ? Role : T extends 'mentionable' ? GuildMember | Role : T extends 'channel' ? GuildChannel : never;
export declare type ParsedSlashArgTypePiece<T extends SlashArgType> = T extends `${infer A}?` ? A extends PureSlashArgType ? ParsedSlashArgType<A> | null : never : T extends PureSlashArgType ? ParsedSlashArgType<T> : never;
export declare type ParsedSlashArgTypeList<A extends SlashArgTypeList> = A extends [] ? [] : A extends [infer B, ...infer C] ? B extends SlashArgType ? C extends [] ? [ParsedSlashArgTypePiece<B>] : C extends SlashArgTypeList ? [ParsedSlashArgTypePiece<B>, ...ParsedSlashArgTypeList<C>] : never : never : never;
export interface BaseSlashCtxInitOption extends InteractionCtxInitOption<CommandInteraction> {
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default abstract class BaseSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends Interaction<CommandInteraction> {
    readonly args: ParsedSlashArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedSlashArgTypeList<ArgTypeList>;
    readonly command: SlashCommand | SubSlashCommand;
    readonly name: string;
    abstract readonly type: string;
    constructor(option: BaseSlashCtxInitOption);
    protected _parseRaw(raw: CommandInteractionOptionResolver): ParsedSlashArgTypeList<ArgTypeList>;
}
