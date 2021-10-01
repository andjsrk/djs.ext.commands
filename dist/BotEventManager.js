"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT_EVENT_NAMES = exports.PURE_BOT_EVENT_NAMES = exports.CLIENT_EVENT_NAMES = void 0;
const ClientManager_1 = require("./ClientManager");
exports.CLIENT_EVENT_NAMES = ['messageCreate', 'messageUpdate', 'messageDelete', 'interactionCreate', 'ready'];
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
            eventName ??= listener.name;
            this.client.on(eventName, listener);
        }
    }
    addListener(listener, eventName) {
        if (typeof listener !== 'function') {
            throw new TypeError('type of listener is not function');
        }
        else {
            eventName ??= listener.name;
            if (!exports.BOT_EVENT_NAMES.includes(eventName)) {
                throw new Error(`invalid event name: ${eventName}`);
            }
            else {
                this._eventListeners ??= {};
                this._eventListeners[eventName] ??= [];
                this._eventListeners[eventName].push(listener);
            }
        }
    }
}
exports.default = BotEventManager;
