import { Bot, Ctx } from '../..'

class MyBot extends Bot {
	@Bot.textCommand()
	async path(ctx: Ctx.Text<[]>) {
		ctx.send('This is absorbed command by path!')
	}
}

export default MyBot
