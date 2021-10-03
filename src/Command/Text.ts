import Base, { BaseCommandInitOption } from './Base'
import * as Ctx from '../Ctx'
import { TextArgTypeList } from '../Ctx/Text'

export interface TextCommandInitOption extends BaseCommandInitOption {
	readonly argTypes: TextArgTypeList | undefined
	readonly callback: (ctx: Ctx.Text) => any
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
	public readonly argTypes: ArgTypeList
	public callback: (ctx: Ctx.Text<ArgTypeList>) => any
	constructor(option: TextCommandInitOption) {
		super({ name: option.name, aliases: option.aliases })
		if (option.argTypes !== undefined) {
			const firstRestArgIndex = option.argTypes.findIndex(argType => argType.startsWith('...'))
			if (0 < option.argTypes.length - 1 - firstRestArgIndex) { // there should not be any argument types back of rest argument type
				throw new Error(`there is argument type back of rest argument type`)
			}
		}
		this.argTypes = [ ...(option.argTypes as ArgTypeList ?? []) ]
		this.callback = option.callback
	}
	public readonly type = 'text'
}
