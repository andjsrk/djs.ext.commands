import { ClientEvents } from 'discord.js';
import ClientManager from './ClientManager';
import * as Ctx from './Ctx';
import { IntentFlags } from './Intents';
export declare const CLIENT_EVENT_NAMES: Array<keyof ClientEvents>;
export declare const PURE_BOT_EVENT_NAMES: Array<keyof PureBotEvents>;
export declare const BOT_EVENT_NAMES: Array<keyof BotEvents>;
export interface PureBotEvents {
    buttonPress: [ctx: Ctx.Button];
    selectMenuSelect: [ctx: Ctx.SelectMenu];
}
export declare type BotEvents = PureBotEvents & ClientEvents;
export declare type BotEventListenerMethodName<T extends keyof ClientEvents = keyof ClientEvents> = `on${Capitalize<T>}`;
export interface BotEventManagerInitOption {
    readonly intents?: Array<IntentFlags>;
}
export default abstract class BotEventManager extends ClientManager {
    protected _eventListeners: Partial<{
        [K in keyof BotEvents]: Array<(...args: BotEvents[K]) => any>;
    }>;
    constructor(option: BotEventManagerInitOption);
    addRawListener<K extends keyof ClientEvents>(listener: ((...args: ClientEvents[K]) => any) & {
        name: K;
    }): void;
    addRawListener<K extends keyof ClientEvents>(listener: (...args: ClientEvents[K]) => any, eventName: K): void;
    addListener<K extends keyof BotEvents>(listener: ((...args: BotEvents[K]) => any) & {
        name: K;
    }): void;
    addListener<K extends keyof BotEvents>(listener: (...args: BotEvents[K]) => any, eventName: K): void;
}
