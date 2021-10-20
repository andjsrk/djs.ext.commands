import type { ApplicationCommandData, ApplicationCommandSubCommandData } from 'discord.js'
import Base from './Base'
import type { BaseCommandInitOption } from './Base'
import type BaseSlashCtx from '../Ctx/BaseSlash'
import type { OptionalSlashArgType, PureSlashArgType } from '../Ctx/BaseSlash'

export interface SlashArg<T extends PureSlashArgType | OptionalSlashArgType> {
	type: T
	name: string
	description?: string
}
export type SlashArgList = Array<SlashArg<PureSlashArgType>> | [ ...Array<SlashArg<PureSlashArgType>>, ...Array<SlashArg<OptionalSlashArgType>> ]

export interface BaseSlashCommandInitOption<T extends BaseSlashCtx> extends BaseCommandInitOption {
	readonly description: string | undefined
	readonly argDefinitions: SlashArgList | undefined
	readonly callback: (ctx: T) => void
}
export default abstract class BaseSlash<T extends BaseSlashCtx> extends Base {
	public readonly argDefinitions: SlashArgList
	public callback: (ctx: T) => void
	public readonly description: string | undefined
	public abstract override readonly type: string
	constructor(option: BaseSlashCommandInitOption<T>) {
		super({ name: option.name, aliases: option.aliases })
		if (/[A-Z]/.test(option.name)) {
			throw new Error('capital letter cannot exist in name of slash command')
		} else if (option.description !== undefined && typeof option.description !== 'string') {
			throw new TypeError('type of description is not string')
		} else if (option.argDefinitions !== undefined && !Array.isArray(option.argDefinitions)) {
			throw new TypeError('type of argDefinitions is not array')
		} else if (typeof option.callback !== 'function') {
			throw new TypeError('type of callback is not function')
		} else {
			if (option.argDefinitions !== undefined) {
				const firstOptionalArgIndex = option.argDefinitions.findIndex(argDefinition => argDefinition.type.endsWith('?'))
				if (firstOptionalArgIndex !== -1 && !option.argDefinitions.slice(firstOptionalArgIndex).every(argDefinition => argDefinition.type.endsWith('?'))) {
					throw new TypeError(`non optional argument ${option.argDefinitions.slice(firstOptionalArgIndex).find(argDefinition => !argDefinition.type.endsWith('?'))!.name} does not precede optional argument`)
				} else {
					for (let i = 0; i < option.argDefinitions.length; i++) {
						const argDefinition = option.argDefinitions[i]
						if (typeof argDefinition !== 'object' || argDefinition === null) {
							throw new TypeError(`type of definition of argument at ${i} is not object`)
						} else if (!('name' in argDefinition)) {
							throw new TypeError(`no property 'name' in definition of argument at ${i}`)
						} else if (typeof argDefinition.name !== 'string') {
							throw new TypeError(`type of property 'name' in definition of argument at ${i} is not string`)
						} else if (argDefinition.description !== undefined && typeof argDefinition.description !== 'string') {
							throw new TypeError(`type of property 'description' in definition of argument at ${i}`)
						} else if (!('type' in argDefinition)) {
							throw new TypeError(`no property 'type' in definition of argument at ${i}`)
						} else if (typeof argDefinition.type !== 'string') {
							throw new TypeError(`type of property 'type' in definition of argument at ${i} is not string`)
						} else {
							const argType = argDefinition.type.replace(/\?$/, '').toUpperCase()
							if (![ 'STRING', 'NUMBER', 'INTEGER', 'BOOLEAN', 'USER', 'ROLE', 'MENTIONABLE', 'CHANNEL' ].includes(argType)) {
								throw new Error(`invalid argument type in definition of argument at ${i}: ${argType}`)
							}
						}
					}
				}
			}
			this.description = option.description
			this.argDefinitions = [ ...option.argDefinitions ?? [] ]
			this.callback = option.callback
		}
	}
	public abstract toRawArray(): Array<ApplicationCommandData | ApplicationCommandSubCommandData>
}
