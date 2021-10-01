import { PermissionString, Snowflake } from 'discord.js';
import Bot from './Bot';
import * as Ctx from './Ctx';
export { default as Bot } from './Bot';
export * as Ctx from './Ctx';
declare type CtxArg = Ctx.Text | Ctx.Button | Ctx.SelectMenu | Ctx.Slash;
export declare type EventListener = (ctx: CtxArg) => any;
export declare type EventDecorator = ((target: Bot, propKey: string) => EventListener) & {
    checker: (ctx: CtxArg) => boolean;
};
export declare function checkAny(...conditions: Array<EventDecorator>): (bot: Bot, listenerName: string) => void;
export declare function check(checker: (ctx: CtxArg) => boolean): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function hasRole(roleResolvable: Snowflake | string): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function hasAnyRole(...roleResolvables: Array<Snowflake | string>): (bot: Bot, listenerName: string) => void;
export declare function botHasRole(roleResolvable: Snowflake | string): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function botHasAnyRole(...roleResolvables: Array<Snowflake | string>): (bot: Bot, listenerName: string) => void;
export declare function hasChannelPermissions(...permissions: Array<PermissionString | bigint>): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function hasGuildPermissions(...permissions: Array<PermissionString | bigint>): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function botHasChannelPermissions(...permissions: Array<PermissionString | bigint>): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function botHasGuildPermissions(...permissions: Array<PermissionString | bigint>): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function guildOnly(): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function dmOnly(): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function isOwner(): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
export declare function isNsfw(): {
    (bot: Bot, listenerName: string): any;
    checker: (ctx: CtxArg) => boolean;
};
