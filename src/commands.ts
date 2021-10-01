import {
	GuildMember,
	PermissionString,
	Snowflake,
} from 'discord.js'
import Bot from './Bot'
import * as Ctx from './Ctx'

export { default as Bot } from './Bot'
export * as Ctx from './Ctx'

type CtxArg = Ctx.Text | Ctx.Button | Ctx.SelectMenu | Ctx.Slash

export type EventListener = (ctx: CtxArg) => any
export type EventDecorator = ((target: Bot, propKey: string) => EventListener) & { checker: (ctx: CtxArg) => boolean }

export function checkAny(...conditions: Array<EventDecorator>) {
	return (bot: Bot, listenerName: string) => {
		const oldListener = bot[listenerName as keyof typeof bot] as unknown as EventListener
		const newListener: EventListener = (ctx: CtxArg) => {
			for (const condition of conditions) {
				if (condition.checker(ctx)) {
					oldListener(ctx)
				}
			}
		}
		;(bot[listenerName as keyof typeof bot] as unknown as EventListener) = newListener
	}
}
export function check(checker: (ctx: CtxArg) => boolean) {
	if (typeof checker !== 'function') {
		throw new TypeError('type of checker is not function')
	} else {
		const result = (bot: Bot, listenerName: string) => {
			const oldListener = bot[listenerName as keyof typeof bot] as unknown as EventListener
			const newListener: EventListener = (ctx: CtxArg) => {
				if (checker(ctx)) {
					oldListener(ctx)
				}
			}
			;(bot[listenerName as keyof typeof bot] as unknown as EventListener) = newListener
			return newListener as any // ts(1241)
		}
		result.checker = checker
		return result
	}
}
export function hasRole(roleResolvable: Snowflake | string) {
	if (typeof roleResolvable !== 'string') {
		throw new TypeError('type of roleResolvable is not string')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.user.roles.cache.some(role => role.id === roleResolvable || role.name === roleResolvable))
	}
}
export function hasAnyRole(...roleResolvables: Array<Snowflake | string>) {
	if (!Array.isArray(roleResolvables)) {
		throw new TypeError('type of roleResolvables is not array')
	} else {
		return checkAny(...roleResolvables.map(roleResolvable => hasRole(roleResolvable)))
	}
}
export function botHasRole(roleResolvable: Snowflake | string) {
	return check(ctx => ctx.guild !== null && ctx.guild.me!.roles.cache.has(roleResolvable))
}
export function botHasAnyRole(...roleResolvables: Array<Snowflake | string>) {
	if (!Array.isArray(roleResolvables)) {
		throw new TypeError('type of roleResolvables is not array')
	} else {
		return checkAny(...roleResolvables.map(roleResolvable => botHasRole(roleResolvable)))
	}
}
export function hasChannelPermissions(...permissions: Array<PermissionString | bigint>) {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.user).has(permissions))
	}
}
export function hasGuildPermissions(...permissions: Array<PermissionString | bigint>) {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.user.permissions.has(permissions))
	}
}
export function botHasChannelPermissions(...permissions: Array<PermissionString | bigint>) {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.guild!.me!).has(permissions))
	}
}
export function botHasGuildPermissions(...permissions: Array<PermissionString | bigint>) {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.channel.type !== 'DM' && ctx.guild!.me!.permissions.has(permissions))
	}
}
export function guildOnly() {
	return check(ctx => ctx.guild !== null)
}
export function dmOnly() {
	return check(ctx => ctx.guild === null)
}
export function isOwner() {
	return check(ctx => ctx.bot.isOwner(ctx.user instanceof GuildMember ? ctx.user.user : ctx.user))
}
export function isNsfw() {
	return check(ctx => ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw)
}
