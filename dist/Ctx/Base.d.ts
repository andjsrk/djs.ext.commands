import { Client, Message, MessageEmbed } from 'discord.js';
import Bot from '../Bot';
export interface MessageSendOption {
    deleteAfter?: number;
}
export interface BaseCtxInitOption {
    readonly bot: Bot;
}
export default abstract class Base {
    readonly bot: Bot;
    readonly client: Client;
    constructor(option: BaseCtxInitOption);
    abstract send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>;
    abstract send(option: MessageSendOption): Promise<Message>;
}
