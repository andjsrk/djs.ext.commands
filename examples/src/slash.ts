/* eslint-disable
    @typescript-eslint/consistent-type-imports,
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-member-accessibility,
    @typescript-eslint/member-ordering,
    @typescript-eslint/naming-convention,
	@typescript-eslint/unbound-method
 */
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
	// eslint-disable-next-line camelcase
	async get_input(ctx: Ctx.Slash<[ 'string' ]>) {
		await ctx.send(`Input: ${Format.inlineCode(ctx.args[0])}`)
	}
	@Bot.slashCommand({ noSubCommand: false })
	// eslint-disable-next-line no-empty-function
	async main() {}
	@Bot.subSlashCommand({ for: 'main' })
	async sub(ctx: Ctx.SubSlash<[]>) {
		await ctx.send('sub command!')
	}
}

const bot = new MyBot()

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.run(TOKEN)
