export interface BaseCommandInitOption {
	readonly name: string
	readonly aliases: Array<string> | undefined
}
export default abstract class Base {
	public readonly aliases: Array<string>
	public readonly name: string
	public abstract callback: (...args: Array<any>) => void
	public abstract readonly type: string
	constructor(option: BaseCommandInitOption) {
		if (typeof option.name !== 'string') {
			throw new TypeError('type of name is not string')
		} else if (option.aliases !== undefined && !Array.isArray(option.aliases)) {
			throw new TypeError('type of aliases is not array')
		} else if (option.aliases?.some(alias => typeof alias !== 'string') ?? false) {
			throw new TypeError('type of item of aliases is not string')
		} else {
			this.name = option.name
			this.aliases = [ ...option.aliases ?? [] ]
		}
	}
}
