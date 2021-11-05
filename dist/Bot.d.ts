import type { Client, DMChannel, Guild, GuildChannel, GuildEmoji, Invite, Message, User } from 'discord.js';
import type { ActivitiesOptions, ClientApplication, MessageMentionOptions, PresenceData, Snowflake } from 'discord.js';
import BotEventManager from './BotEventManager';
import type { BotEventListenerMethodName, BotEvents } from './BotEventManager';
import * as Command from './Command';
import type { TextCommandInitOption } from './Command/Text';
import type { SlashCommandInitOption } from './Command/Slash';
import type { SubSlashCommandInitOption } from './Command/SubSlash';
import type { IntentFlags } from './Intents';
import WeakReadonlyArray from './WeakReadonlyArray';
declare type WeakRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export interface ButtonListenerOption {
    customId?: string;
}
export interface SelectMenuListenerOption {
    customId?: string;
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
    readonly channels: Array<Exclude<GuildChannel, DMChannel>>;
    commands: Array<Command.Text | Command.Slash>;
    readonly emojis: Array<GuildEmoji>;
    readonly guilds: Array<Guild>;
    readonly ownerId: Snowflake | null;
    readonly prefix: string;
    readonly privateChannels: Array<DMChannel>;
    readonly users: Array<User>;
    constructor(option?: BotInitOption);
    static button(option?: ButtonListenerOption): (bot: Bot, listenerName: string) => void;
    static event(eventName: keyof BotEvents): (bot: Bot, listenerName: string) => void;
    static event(bot: Bot, listenerName: BotEventListenerMethodName): void;
    static selectMenu(option?: SelectMenuListenerOption): (bot: Bot, listenerName: string) => void;
    static slashCommand(option?: Partial<Omit<SlashCommandInitOption, 'callback'>>): (bot: Bot, listenerName: string) => void;
    static subSlashCommand(option: WeakRequired<Partial<Omit<SubSlashCommandInitOption, 'callback'>>, 'for'>): (bot: Bot, listenerName: string) => void;
    static textCommand(option?: Partial<Omit<TextCommandInitOption, 'callback'>>): (bot: Bot, listenerName: string) => void;
    get activities(): Array<ActivitiesOptions> | undefined;
    get allowedMentions(): MessageMentionOptions | undefined;
    get intents(): Array<IntentFlags>;
    get latency(): number;
    get user(): User | null;
    absorbCommands(bot: typeof Bot): void;
    absorbCommandsByPath(path: string): Promise<void>;
    absorbCommandsSyncByPath(path: string): void;
    addCommand(command: Command.Text | Command.Slash): void;
    changePresence(option: Omit<PresenceData, 'shardId'>): Promise<void>;
    createGuild(name: string, option: {
        region?: string;
        icon?: string;
        code?: string;
    }): Promise<Guild>;
    deleteInvite(invite: Invite): Promise<void>;
    fetchApplicationInfo(): Promise<ClientApplication | null>;
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
