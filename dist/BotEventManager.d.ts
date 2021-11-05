import type { ClientEvents } from 'discord.js';
import ClientManager from './ClientManager';
import type * as Ctx from './Ctx';
import type { IntentFlags } from './Intents';
export declare const CLIENT_EVENT_NAMES: Array<keyof ClientEvents>;
export interface PureBotEvents {
    buttonPress: [ctx: Ctx.Button];
    selectMenuSelect: [ctx: Ctx.SelectMenu];
}
export declare type BotEvents = PureBotEvents & ClientEvents;
export declare const PURE_BOT_EVENT_NAMES: Array<keyof PureBotEvents>;
export declare const BOT_EVENT_NAMES: Array<keyof BotEvents>;
export declare type BotEventListenerMethodName<T extends keyof ClientEvents = keyof ClientEvents> = `on${Capitalize<T>}`;
export interface BotEventManagerInitOption {
    readonly intents?: Array<IntentFlags>;
}
export default abstract class BotEventManager extends ClientManager {
    protected _eventListeners: Partial<{
        [K in keyof BotEvents]: Array<(...args: BotEvents[K]) => void>;
    }>;
    constructor(option: BotEventManagerInitOption);
    addListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => void) & {
        name: K;
    }): void;
    addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName: K): void;
    addRawListener<K extends keyof ClientEvents>(listener: ((...args: ClientEvents[K]) => void) & {
        name: K;
    }): void;
    addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => void, eventName: K): void;
    removeListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => void) & {
        name: K;
    }): void;
    removeListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => void, eventName: K): void;
}
