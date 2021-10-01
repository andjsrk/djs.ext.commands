import Bot from '../Bot'

export interface BaseCommandInitOption {
	readonly bot: Bot
	readonly name: string
	readonly aliases: Array<string> | undefined
}
export default abstract class Base {
	public readonly bot: Bot
	public readonly name: string
	public readonly aliases: Array<string>
	public abstract callback: (...args: Array<any>) => any
	constructor(option: BaseCommandInitOption) {
		if (typeof option.name !== 'string') {
			throw new TypeError('type of name is not string')
		} else if (option.aliases !== undefined && !Array.isArray(option.aliases)) {
			throw new TypeError('type of aliases is not array')
		} else if (option.aliases !== undefined && option.aliases.some(aliase => typeof aliase !== 'string')) {
			throw new TypeError('type of item of aliases is not string')
		} else {
			this.bot = option.bot
			this.name = option.name
			this.aliases = [ ...(option.aliases ?? []) ]
		}
	}
	public abstract readonly type: string
}
