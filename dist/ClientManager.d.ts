import { Client } from 'discord.js';
import { IntentFlags } from './Intents';
export interface ClientOption {
    intents: Array<IntentFlags>;
}
export interface ClientManagerInitOption {
    readonly intents?: Array<IntentFlags>;
}
export default class ClientManager {
    protected readonly _clientOption: ClientOption;
    readonly client: Client;
    constructor(option: ClientManagerInitOption);
}
