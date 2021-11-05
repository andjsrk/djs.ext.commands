import Base from './Base'
import type { BaseCommandInitOption } from './Base'
import type * as Ctx from '../Ctx'
import type { TextArgTypeList } from '../Ctx/Text'

export interface TextCommandInitOption extends BaseCommandInitOption {
	readonly argTypes: TextArgTypeList | undefined
	readonly callback: (ctx: Ctx.Text) => void
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
	public readonly argTypes: ArgTypeList
	public callback: (ctx: Ctx.Text<ArgTypeList>) => void
	public override readonly type
	constructor(option: TextCommandInitOption) {
		super({ name: option.name, aliases: option.aliases })
		if (option.argTypes !== undefined) {
			const firstRestArgIndex = option.argTypes.findIndex(argType => argType.startsWith('...'))
			if (firstRestArgIndex !== -1 && option.argTypes.length - 1 - firstRestArgIndex > 0) { // there should not be any argument types back of rest argument type
				throw new Error('there is argument type back of rest argument type')
			}
		}
		this.argTypes = [ ...(option.argTypes ?? []) as ArgTypeList ]
		this.callback = option.callback
		this.type = 'text' as const
	}
}
