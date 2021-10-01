import { MessageComponentInteraction, CommandInteraction, Guild, GuildMember, Message, MessageEmbed, User, InteractionReplyOptions, TextBasedChannels } from 'discord.js';
import Base, { BaseCtxInitOption, MessageSendOption } from './Base';
export interface InteractionCtxInitOption extends BaseCtxInitOption {
    readonly interaction: MessageComponentInteraction | CommandInteraction;
}
export default abstract class Interaction extends Base {
    readonly interaction: MessageComponentInteraction | CommandInteraction;
    readonly guild: Guild | null;
    readonly channel: TextBasedChannels;
    readonly user: GuildMember | User;
    constructor(option: InteractionCtxInitOption);
    abstract readonly type: string;
    send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message>;
    send(option: InteractionReplyOptions & MessageSendOption): Promise<Message>;
}
