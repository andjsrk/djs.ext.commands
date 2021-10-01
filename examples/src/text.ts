import { Formatters as Format } from 'discord.js'
import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

class MyBot extends Bot {
	@Bot.event
	async onReady() {
		console.log('I\'m ready!')
	}
	@Bot.textCommand()
	async ping(ctx: Ctx.Text) {
		await ctx.send('Pong!')
	}
	@Bot.textCommand({ argTypes: [ '...string' ] })
	async get_input(ctx: Ctx.Text<[ '...string' ]>) {
		await ctx.send(`Input: ${Format.inlineCode(ctx.args[0].join(' '))}`)
	}
}

const bot = new MyBot({ prefix: '!' })

bot.run(TOKEN)
