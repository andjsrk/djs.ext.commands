/* eslint-disable
    @typescript-eslint/consistent-type-imports,
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-member-accessibility
 */
import { Bot, Ctx } from '../..'

class MyBot extends Bot {
	@Bot.textCommand()
	async value(ctx: Ctx.Text<[]>) {
		await ctx.send('This is absorbed command by value!')
	}
}

export default MyBot
