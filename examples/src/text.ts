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
	@Bot.textCommand()
	async ping(ctx: Ctx.Text) {
		await ctx.send('Pong!')
	}
	@Bot.textCommand({ argTypes: [ '...string' ] })
	// eslint-disable-next-line camelcase
	async get_input(ctx: Ctx.Text<[ '...string' ]>) {
		await ctx.send(`Input: ${Format.inlineCode(ctx.args[0].join(' '))}`)
	}
}

const bot = new MyBot({ prefix: '!' })

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.run(TOKEN)
