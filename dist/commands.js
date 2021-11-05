"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNsfw = exports.isOwner = exports.dmOnly = exports.guildOnly = exports.botHasGuildPermissions = exports.botHasChannelPermissions = exports.hasGuildPermissions = exports.hasChannelPermissions = exports.botHasAnyRole = exports.botHasRole = exports.hasAnyRole = exports.hasRole = exports.check = exports.checkAny = exports.Ctx = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
var Bot_1 = require("./Bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return Bot_1.default; } });
exports.Ctx = require("./Ctx");
const checkAny = (...conditions) => (bot, listenerName) => {
    const oldListener = bot[listenerName];
    const newListener = (ctx) => {
        for (const condition of conditions) {
            if (condition.checker(ctx)) {
                oldListener(ctx);
            }
        }
    };
    bot[listenerName] = newListener;
};
exports.checkAny = checkAny;
const check = (checker) => {
    if (typeof checker !== 'function') {
        throw new TypeError('type of checker is not function');
    }
    else {
        const result = (bot, listenerName) => {
            const oldListener = bot[listenerName];
            const newListener = (ctx) => {
                if (checker(ctx)) {
                    oldListener(ctx);
                }
            };
            bot[listenerName] = newListener;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
            return newListener; // ts(1241)
        };
        result.checker = checker;
        return result;
    }
};
exports.check = check;
const hasRole = (roleResolvable) => {
    if (typeof roleResolvable !== 'string') {
        throw new TypeError('type of roleResolvable is not string');
    }
    else {
        return (0, exports.check)(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.user.roles.cache.some(role => role.id === roleResolvable || role.name === roleResolvable));
    }
};
exports.hasRole = hasRole;
const hasAnyRole = (...roleResolvables) => {
    if (!Array.isArray(roleResolvables)) {
        throw new TypeError('type of roleResolvables is not array');
    }
    else {
        return (0, exports.checkAny)(...roleResolvables.map(roleResolvable => (0, exports.hasRole)(roleResolvable)));
    }
};
exports.hasAnyRole = hasAnyRole;
const botHasRole = (roleResolvable) => (0, exports.check)(ctx => ctx.guild !== null && ctx.guild.me.roles.cache.has(roleResolvable));
exports.botHasRole = botHasRole;
const botHasAnyRole = (...roleResolvables) => {
    if (!Array.isArray(roleResolvables)) {
        throw new TypeError('type of roleResolvables is not array');
    }
    else {
        return (0, exports.checkAny)(...roleResolvables.map(roleResolvable => (0, exports.botHasRole)(roleResolvable)));
    }
};
exports.botHasAnyRole = botHasAnyRole;
const hasChannelPermissions = (...permissions) => {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return (0, exports.check)(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.user).has(permissions));
    }
};
exports.hasChannelPermissions = hasChannelPermissions;
const hasGuildPermissions = (...permissions) => {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return (0, exports.check)(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.user.permissions.has(permissions));
    }
};
exports.hasGuildPermissions = hasGuildPermissions;
const botHasChannelPermissions = (...permissions) => {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return (0, exports.check)(ctx => ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.guild.me).has(permissions));
    }
};
exports.botHasChannelPermissions = botHasChannelPermissions;
const botHasGuildPermissions = (...permissions) => {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return (0, exports.check)(ctx => ctx.channel.type !== 'DM' && ctx.guild.me.permissions.has(permissions));
    }
};
exports.botHasGuildPermissions = botHasGuildPermissions;
const guildOnly = () => (0, exports.check)(ctx => ctx.guild !== null);
exports.guildOnly = guildOnly;
const dmOnly = () => (0, exports.check)(ctx => ctx.guild === null);
exports.dmOnly = dmOnly;
const isOwner = () => (0, exports.check)(ctx => ctx.bot.isOwner(ctx.user instanceof discord_js_1.GuildMember ? ctx.user.user : ctx.user));
exports.isOwner = isOwner;
const isNsfw = () => (0, exports.check)(ctx => ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw);
exports.isNsfw = isNsfw;
