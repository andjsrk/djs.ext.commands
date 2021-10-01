import { Channel, Client, Message, User, MessageMentionOptions, PresenceData } from 'discord.js';
import BotEventManager, { BotEvents, BotEventListenerMethodName } from './BotEventManager';
import * as Command from './Command';
import { TextCommandInitOption } from './Command/Text';
import { SlashCommandInitOption } from './Command/Slash';
import { SubSlashCommandInitOption } from './Command/SubSlash';
import type { IntentFlags } from './Intents';
import WeakReadonlyArray from './WeakReadonlyArray';
declare type WeakRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare namespace ListenerOption {
    interface Button {
        customId?: string;
    }
    interface SelectMenu {
        customId?: string;
    }
}
export interface BotInitOption {
    readonly prefix?: string;
    readonly intents?: Array<IntentFlags>;
}
export default class Bot extends BotEventManager {
    readonly prefix: string;
    readonly cachedMessages: WeakReadonlyArray<Message>;
    commands: Array<Command.Text | Command.Slash>;
    channels: Array<Channel>;
    constructor(option?: BotInitOption);
    static event(eventName: keyof BotEvents): (bot: Bot, listenerName: string) => void;
    static event(bot: Bot, listenerName: BotEventListenerMethodName): void;
    static textCommand(option?: Partial<Omit<TextCommandInitOption, 'callback'>>): (bot: Bot, listenerName: string) => void;
    static slashCommand(option?: Partial<Omit<SlashCommandInitOption, 'callback'>>): (bot: Bot, listenerName: string) => void;
    static subSlashCommand(option: WeakRequired<Partial<Omit<SubSlashCommandInitOption, 'callback'>>, 'for'>): (bot: Bot, listenerName: string) => void;
    static button(option?: ListenerOption.Button): (bot: Bot, listenerName: string) => void;
    static selectMenu(option?: ListenerOption.SelectMenu): (bot: Bot, listenerName: string) => void;
    get activities(): {
        type?: number | "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "CUSTOM" | "COMPETING" | undefined;
        name?: string | undefined;
        url?: string | undefined;
    }[] | undefined;
    get allowedMentions(): MessageMentionOptions | undefined;
    get intents(): IntentFlags[];
    absorbCommands(bot: typeof Bot): void;
    absorbCommandsSyncByPath(path: string): void;
    absorbCommandsByPath(path: string): Promise<void>;
    addCommand(command: Command.Text | Command.Slash): void;
    changePresence(option: Omit<PresenceData, 'shardId'>): Promise<void>;
    createGuild(name: string, option: {
        region?: string;
        icon?: string;
        code?: string;
    }): Promise<import("discord.js").Guild>;
    fetchApplicationInfo(): Promise<import("discord.js").ClientApplication | undefined>;
    isReady(): this is this & {
        client: Client<true>;
    };
    isOwner(user: User): boolean;
    run(token: string): Promise<void>;
}
export {};
