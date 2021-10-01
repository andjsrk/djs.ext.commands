import { Formatters as Format } from 'discord.js'
import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

class MyBot extends Bot {
	@Bot.event
	async onReady() {
		console.log('I\'m ready!')
	}
	@Bot.slashCommand()
	async ping(ctx: Ctx.Slash<[]>) {
		await ctx.send('Pong!')
	}
	@Bot.slashCommand({ name: 'slash' })
	async foo(ctx: Ctx.Slash<[]>) {
		await ctx.send('This isn\'t what I wrote!')
	}
	@Bot.slashCommand({ argDefinitions: [ { name: 'input', type: 'string' } ] })
	async get_input(ctx: Ctx.Slash<[ 'string' ]>) {
		await ctx.send(`Input: ${Format.inlineCode(ctx.args[0])}`)
	}
	@Bot.slashCommand({ noSubCommand: false })
	async main() {}
	@Bot.subSlashCommand({ for: 'main' })
	async sub(ctx: Ctx.SubSlash<[]>) {
		await ctx.send('sub command!')
	}
}

const bot = new MyBot()

bot.run(TOKEN)
