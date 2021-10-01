import { Bot, Ctx } from '../..'

class MyBot extends Bot{
	@Bot.textCommand()
	async value(ctx: Ctx.Text<[]>) {
		ctx.send('This is absorbed command by value!')
	}
}

export default MyBot
