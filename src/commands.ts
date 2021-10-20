import { GuildMember } from 'discord.js'
import type {
	PermissionString,
	Snowflake,
} from 'discord.js'
import type Bot from './Bot'
import type * as Ctx from './Ctx'

export { default as Bot } from './Bot'
export * as Ctx from './Ctx'

type CtxArg = Ctx.Text | Ctx.Button | Ctx.SelectMenu | Ctx.Slash

export type EventListener = (ctx: CtxArg) => void
export type EventDecorator = ((bot: Bot, listenerName: string) => EventListener) & { checker: (ctx: CtxArg) => boolean; }

export const checkAny = (...conditions: Array<EventDecorator>) =>
	(bot: Bot, listenerName: string): void => {
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
export const check = (checker: (ctx: CtxArg) => boolean): EventDecorator => {
	if (typeof checker !== 'function') {
		throw new TypeError('type of checker is not function')
	} else {
		const result = (bot: Bot, listenerName: string): EventListener => {
			const oldListener = bot[listenerName as keyof typeof bot] as unknown as EventListener
			const newListener: EventListener = (ctx: CtxArg) => {
				if (checker(ctx)) {
					oldListener(ctx)
				}
			}
			;(bot[listenerName as keyof typeof bot] as unknown as EventListener) = newListener
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
			return newListener as any // ts(1241)
		}
		result.checker = checker
		return result
	}
}
export const hasRole = (roleResolvable: Snowflake | string): EventDecorator => {
	if (typeof roleResolvable !== 'string') {
		throw new TypeError('type of roleResolvable is not string')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.user.roles.cache.some(role => role.id === roleResolvable || role.name === roleResolvable))
	}
}
export const hasAnyRole = (...roleResolvables: Array<Snowflake | string>): ReturnType<typeof checkAny> => {
	if (!Array.isArray(roleResolvables)) {
		throw new TypeError('type of roleResolvables is not array')
	} else {
		return checkAny(...roleResolvables.map(roleResolvable => hasRole(roleResolvable)))
	}
}
export const botHasRole = (roleResolvable: Snowflake | string): EventDecorator => check(ctx => ctx.guild !== null && ctx.guild.me!.roles.cache.has(roleResolvable))
export const botHasAnyRole = (...roleResolvables: Array<Snowflake | string>): ReturnType<typeof checkAny> => {
	if (!Array.isArray(roleResolvables)) {
		throw new TypeError('type of roleResolvables is not array')
	} else {
		return checkAny(...roleResolvables.map(roleResolvable => botHasRole(roleResolvable)))
	}
}
export const hasChannelPermissions = (...permissions: Array<PermissionString | bigint>): EventDecorator => {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.user).has(permissions))
	}
}
export const hasGuildPermissions = (...permissions: Array<PermissionString | bigint>): EventDecorator => {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.user instanceof GuildMember && ctx.user.permissions.has(permissions))
	}
}
export const botHasChannelPermissions = (...permissions: Array<PermissionString | bigint>): EventDecorator => {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.channel.type !== 'DM' && ctx.channel.permissionsFor(ctx.guild!.me!).has(permissions))
	}
}
export const botHasGuildPermissions = (...permissions: Array<PermissionString | bigint>): EventDecorator => {
	if (!Array.isArray(permissions)) {
		throw new TypeError('type of permissions is not array')
	} else {
		return check(ctx => ctx.channel.type !== 'DM' && ctx.guild!.me!.permissions.has(permissions))
	}
}
export const guildOnly = (): EventDecorator => check(ctx => ctx.guild !== null)
export const dmOnly = (): EventDecorator => check(ctx => ctx.guild === null)
export const isOwner = (): EventDecorator => check(ctx => ctx.bot.isOwner(ctx.user instanceof GuildMember ? ctx.user.user : ctx.user))
export const isNsfw = (): EventDecorator => check(ctx => ctx.channel.type === 'GUILD_TEXT' && ctx.channel.nsfw)
