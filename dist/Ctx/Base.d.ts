import type { Client, GuildMember, Message, MessageEmbed, User } from 'discord.js';
import type Bot from '../Bot';
export interface MessageSendOption {
    readonly deleteAfter?: number;
}
export interface BaseCtxInitOption {
    readonly bot: Bot;
}
export default abstract class Base {
    readonly bot: Bot;
    readonly client: Client;
    abstract readonly type: string;
    abstract readonly user: GuildMember | User;
    constructor(option: BaseCtxInitOption);
    abstract send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message | undefined>;
    abstract send(option: MessageSendOption): Promise<Message | undefined>;
}
