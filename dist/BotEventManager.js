"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT_EVENT_NAMES = exports.PURE_BOT_EVENT_NAMES = exports.CLIENT_EVENT_NAMES = void 0;
const ClientManager_1 = require("./ClientManager");
exports.CLIENT_EVENT_NAMES = [
    'debug', 'error', 'warn',
    'ready', 'rateLimit', 'invalidRequestWarning', 'invalidated',
    'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate',
    'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate',
    'emojiCreate', 'emojiDelete', 'emojiUpdate',
    'guildBanAdd', 'guildBanRemove',
    'guildCreate', 'guildDelete', 'guildUpdate',
    'guildIntegrationsUpdate',
    'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMemberUpdate', 'guildMembersChunk',
    'guildUnavailable',
    'interactionCreate',
    'inviteCreate', 'inviteDelete',
    'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageUpdate',
    'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',
    'presenceUpdate',
    'roleCreate', 'roleDelete', 'roleUpdate',
    'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume',
    'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate',
    'stickerCreate', 'stickerDelete', 'stickerUpdate',
    'threadCreate', 'threadDelete', 'threadListSync', 'threadMemberUpdate', 'threadMembersUpdate', 'threadUpdate',
    'typingStart',
    'userUpdate',
    'voiceStateUpdate',
    'webhookUpdate',
];
exports.PURE_BOT_EVENT_NAMES = [
    'buttonPress', 'selectMenuSelect',
];
exports.BOT_EVENT_NAMES = [
    ...exports.CLIENT_EVENT_NAMES,
    ...exports.PURE_BOT_EVENT_NAMES
];
class BotEventManager extends ClientManager_1.default {
    constructor(option) {
        super({ intents: option.intents });
        this._eventListeners ??= {};
        for (const eventName of exports.BOT_EVENT_NAMES) {
            if (exports.CLIENT_EVENT_NAMES.includes(eventName)) {
                const guardedEventName = eventName;
                this.addRawListener((...args) => {
                    const listeners = this._eventListeners[guardedEventName];
                    if (listeners !== undefined) {
                        for (const listener of listeners) {
                            listener(...args);
                        }
                    }
                }, guardedEventName);
            }
        }
    }
    addRawListener(listener, eventName) {
        if (typeof listener !== 'function') {
            throw new TypeError('type of listener is not function');
        }
        else {
            this.client.on(eventName ?? listener.name, listener);
        }
    }
    addListener(listener, eventName) {
        if (typeof listener !== 'function') {
            throw new TypeError('type of listener is not function');
        }
        else {
            const realEventName = eventName ?? listener.name;
            if (!exports.BOT_EVENT_NAMES.includes(realEventName)) {
                throw new Error(`invalid event name: ${realEventName}`);
            }
            else {
                this._eventListeners ??= {};
                this._eventListeners[realEventName] ??= [];
                this._eventListeners[realEventName].push(listener);
            }
        }
    }
    removeListener(listener, eventName) {
        if (typeof listener !== 'function') {
            throw new TypeError('type of listener is not function');
        }
        else {
            const realEventName = eventName ?? listener.name;
            if (!exports.BOT_EVENT_NAMES.includes(realEventName)) {
                throw new Error(`invalid event name: ${realEventName}`);
            }
            else {
                const foundIndex = (this._eventListeners[realEventName] ?? []).indexOf(listener);
                if (-1 !== foundIndex) {
                    this._eventListeners[realEventName].splice(foundIndex, 1);
                }
            }
        }
    }
}
exports.default = BotEventManager;
