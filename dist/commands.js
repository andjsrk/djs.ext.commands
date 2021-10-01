"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNsfw = exports.isOwner = exports.dmOnly = exports.guildOnly = exports.botHasGuildPermissions = exports.botHasChannelPermissions = exports.hasGuildPermissions = exports.hasChannelPermissions = exports.botHasAnyRole = exports.botHasRole = exports.hasAnyRole = exports.hasRole = exports.check = exports.checkAny = exports.Ctx = exports.Bot = void 0;
const discord_js_1 = require("discord.js");
var Bot_1 = require("./Bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return Bot_1.default; } });
exports.Ctx = require("./Ctx");
function checkAny(...conditions) {
    return (bot, listenerName) => {
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
}
exports.checkAny = checkAny;
function check(checker) {
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
            return newListener; // ts(1241)
        };
        result.checker = checker;
        return result;
    }
}
exports.check = check;
function hasRole(roleResolvable) {
    if (typeof roleResolvable !== 'string') {
        throw new TypeError('type of roleResolvable is not string');
    }
    else {
        return check(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.user.roles.cache.some(role => role.id === roleResolvable || role.name === roleResolvable));
    }
}
exports.hasRole = hasRole;
function hasAnyRole(...roleResolvables) {
    if (!Array.isArray(roleResolvables)) {
        throw new TypeError('type of roleResolvables is not array');
    }
    else {
        return checkAny(...roleResolvables.map(roleResolvable => hasRole(roleResolvable)));
    }
}
exports.hasAnyRole = hasAnyRole;
function botHasRole(roleResolvable) {
    return check(ctx => ctx.guild !== null && ctx.guild.me.roles.cache.has(roleResolvable));
}
exports.botHasRole = botHasRole;
function botHasAnyRole(...roleResolvables) {
    if (!Array.isArray(roleResolvables)) {
        throw new TypeError('type of roleResolvables is not array');
    }
    else {
        return checkAny(...roleResolvables.map(roleResolvable => botHasRole(roleResolvable)));
    }
}
exports.botHasAnyRole = botHasAnyRole;
function hasChannelPermissions(...permissions) {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return check(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.user).has(permissions));
    }
}
exports.hasChannelPermissions = hasChannelPermissions;
function hasGuildPermissions(...permissions) {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return check(ctx => ctx.user instanceof discord_js_1.GuildMember && ctx.user.permissions.has(permissions));
    }
}
exports.hasGuildPermissions = hasGuildPermissions;
function botHasChannelPermissions(...permissions) {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return check(ctx => ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.guild.me).has(permissions));
    }
}
exports.botHasChannelPermissions = botHasChannelPermissions;
function botHasGuildPermissions(...permissions) {
    if (!Array.isArray(permissions)) {
        throw new TypeError('type of permissions is not array');
    }
    else {
        return check(ctx => ctx.channel.type !== 'DM' && ctx.guild.me.permissions.has(permissions));
    }
}
exports.botHasGuildPermissions = botHasGuildPermissions;
function guildOnly() {
    return check(ctx => ctx.guild !== null);
}
exports.guildOnly = guildOnly;
function dmOnly() {
    return check(ctx => ctx.guild === null);
}
exports.dmOnly = dmOnly;
function isOwner() {
    return check(ctx => ctx.bot.isOwner(ctx.user instanceof discord_js_1.GuildMember ? ctx.user.user : ctx.user));
}
exports.isOwner = isOwner;
function isNsfw() {
    return check(ctx => ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw);
}
exports.isNsfw = isNsfw;
