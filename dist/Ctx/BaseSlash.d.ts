import { CommandInteraction, CommandInteractionOptionResolver, GuildChannel, GuildMember, Role, User } from 'discord.js';
import Interaction, { InteractionCtxInitOption } from './Interaction';
import SlashCommand from '../Command/Slash';
import SubSlashCommand from '../Command/SubSlash';
export declare type PureSlashArgType = 'string' | 'number' | 'integer' | 'boolean' | 'user' | 'role' | 'mentionable' | 'channel';
export declare type OptionalSlashArgType = `${PureSlashArgType}?`;
export declare type SlashArgType = PureSlashArgType | OptionalSlashArgType;
export declare type SlashArgTypeList = ReadonlyArray<PureSlashArgType> | readonly [...ReadonlyArray<PureSlashArgType>, ...ReadonlyArray<OptionalSlashArgType>];
export declare type ParsedSlashArgType<T extends PureSlashArgType> = T extends 'string' ? string : T extends 'number' | 'integer' ? number : T extends 'boolean' ? boolean : T extends 'user' ? User : T extends 'role' ? Role : T extends 'mentionable' ? GuildMember | Role : T extends 'channel' ? GuildChannel : never;
export declare type ParsedSlashArgTypePiece<T extends SlashArgType> = T extends `${infer A}?` ? A extends PureSlashArgType ? ParsedSlashArgType<A> | null : never : T extends PureSlashArgType ? ParsedSlashArgType<T> : never;
export declare type ParsedSlashArgTypeList<A extends SlashArgTypeList> = A extends [] ? [] : A extends [infer B, ...infer C] ? B extends SlashArgType ? C extends [] ? [ParsedSlashArgTypePiece<B>] : C extends SlashArgTypeList ? [ParsedSlashArgTypePiece<B>, ...ParsedSlashArgTypeList<C>] : never : never : never;
export interface BaseSlashCtxInitOption extends InteractionCtxInitOption {
}
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
export default abstract class BaseSlash<ArgTypeList extends SlashArgTypeList = SlashArgTypeList> extends Interaction {
    readonly interaction: CommandInteraction;
    readonly command: SlashCommand | SubSlashCommand;
    readonly name: string;
    readonly args: ParsedSlashArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedSlashArgTypeList<ArgTypeList>;
    constructor(option: BaseSlashCtxInitOption);
    abstract readonly type: string;
    protected parseRawToArgs<A extends SlashArgTypeList>(raw: CommandInteractionOptionResolver): ParsedSlashArgTypeList<A>;
}
