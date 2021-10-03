import { Client, DMChannel, Guild, GuildChannel, GuildEmoji, Invite, Message, User, MessageMentionOptions, PresenceData, Snowflake } from 'discord.js';
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
    readonly intents?: Array<IntentFlags>;
    readonly ownerId?: Snowflake;
    readonly prefix?: string;
}
export default class Bot extends BotEventManager {
    protected readonly _eventWaiters: {
        [K in keyof BotEvents]?: Array<{
            check: ((...args: BotEvents[K]) => boolean) | undefined;
            resolve: (...args: BotEvents[K]) => void;
        }>;
    };
    readonly cachedMessages: WeakReadonlyArray<Message>;
    commands: Array<Command.Text | Command.Slash>;
    readonly channels: Array<Exclude<GuildChannel, DMChannel>>;
    readonly emojis: Array<GuildEmoji>;
    readonly guilds: Array<Guild>;
    readonly ownerId: Snowflake | null;
    readonly prefix: string;
    readonly privateChannels: Array<DMChannel>;
    readonly users: Array<User>;
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
    get latency(): number;
    get user(): import("discord.js").ClientUser | null;
    absorbCommands(bot: typeof Bot): void;
    absorbCommandsSyncByPath(path: string): void;
    absorbCommandsByPath(path: string): Promise<void>;
    addCommand(command: Command.Text | Command.Slash): void;
    changePresence(option: Omit<PresenceData, 'shardId'>): Promise<void>;
    createGuild(name: string, option: {
        region?: string;
        icon?: string;
        code?: string;
    }): Promise<Guild>;
    deleteInvite(invite: Invite): Promise<void>;
    fetchApplicationInfo(): Promise<import("discord.js").ClientApplication | undefined>;
    isOwner(user: User): boolean;
    isReady(): this is this & {
        client: Client<true>;
    };
    run(token: string): Promise<void>;
    waitFor<K extends keyof BotEvents>(eventName: K, option?: {
        check?: (...args: BotEvents[K]) => boolean;
        timeout?: number;
    }): Promise<BotEvents[K]>;
}
export {};
