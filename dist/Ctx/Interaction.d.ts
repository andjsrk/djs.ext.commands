import { MessageEmbed } from 'discord.js';
import type { CommandInteraction, Guild, GuildMember, Message, MessageComponentInteraction, User } from 'discord.js';
import type { InteractionReplyOptions, TextBasedChannels } from 'discord.js';
import Base from './Base';
import type { BaseCtxInitOption, MessageSendOption } from './Base';
export interface InteractionCtxInitOption<T extends CommandInteraction | MessageComponentInteraction> extends BaseCtxInitOption {
    readonly interaction: T;
}
export default abstract class Interaction<T extends CommandInteraction | MessageComponentInteraction> extends Base {
    readonly channel: TextBasedChannels;
    readonly guild: Guild | null;
    readonly interaction: T;
    readonly user: GuildMember | User;
    constructor(option: InteractionCtxInitOption<T>);
    send(content: string | MessageEmbed, option?: MessageSendOption): Promise<Message | undefined>;
    send(option: InteractionReplyOptions & MessageSendOption): Promise<Message | undefined>;
}
