import { MessageEmbed } from 'discord.js';
import type { Guild, GuildMember, Message, Role, TextChannel, User, VoiceChannel } from 'discord.js';
import type { MessageOptions, TextBasedChannels } from 'discord.js';
import Base from './Base';
import type { BaseCtxInitOption, MessageSendOption } from './Base';
import type TextCommand from '../Command/Text';
export declare type PureTextArgType = 'string' | 'number' | 'integer' | 'naturalNumber' | 'decimal' | 'boolean' | 'user' | 'member' | 'role' | 'channel' | 'textChannel' | 'voiceChannel';
export declare type RestTextArgType = `...${PureTextArgType}`;
export declare type TextArgTypeList = ReadonlyArray<PureTextArgType> | readonly [...ReadonlyArray<PureTextArgType>, RestTextArgType];
export declare type ParsedTextArgTypePiece<T extends PureTextArgType> = T extends 'string' ? string : T extends 'number' | 'integer' | 'naturalNumber' | 'decimal' ? number : T extends 'boolean' ? boolean : T extends 'user' ? User : T extends 'member' ? GuildMember : T extends 'role' ? Role : T extends 'channel' ? TextChannel | VoiceChannel : T extends 'textChannel' ? TextChannel : T extends 'voiceChannel' ? VoiceChannel : never;
export declare type ParsedTextArgTypeList<A extends TextArgTypeList> = A extends [] ? [] : A extends [infer B, ...infer C] ? C extends Array<any> ? B extends `...${infer T}` ? T extends PureTextArgType ? [Array<ParsedTextArgTypePiece<T>>] : never : B extends PureTextArgType ? C extends [] ? [ParsedTextArgTypePiece<B>] : [ParsedTextArgTypePiece<B> | null, ...ParsedTextArgTypeList<C>] : never : never : never;
export interface TextCtxInitOption extends BaseCtxInitOption {
    readonly message: Message;
    readonly command: TextCommand;
    readonly matchedAlias: string;
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
    readonly args: ParsedTextArgTypeList<ArgTypeList> extends never ? Array<any> : ParsedTextArgTypeList<ArgTypeList>;
    readonly channel: TextBasedChannels;
    readonly command: TextCommand;
    readonly content: string;
    readonly guild: Guild | null;
    readonly matchedAlias: string;
    readonly me: GuildMember | User;
    readonly message: Message;
    readonly type: string;
    readonly user: GuildMember | User;
    constructor(option: TextCtxInitOption);
    protected _parseOneRawArg(argType: PureTextArgType, content: string): ParsedTextArgTypePiece<PureTextArgType> | null;
    protected _parseRaw(raw: string): ParsedTextArgTypeList<ArgTypeList>;
    reply(content: string | MessageEmbed | MessageOptions): Promise<Message>;
    send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>;
    send(option: MessageOptions & MessageSendOption): Promise<Message>;
}
