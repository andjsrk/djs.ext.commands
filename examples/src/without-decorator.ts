/* eslint-disable
    @typescript-eslint/consistent-type-imports,
    @typescript-eslint/explicit-function-return-type,
	@typescript-eslint/no-explicit-any,
	@typescript-eslint/no-unsafe-member-access
 */
import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

const bot = new Bot({ prefix: '!' })

;(bot as any).onReady = () => {
	console.log('I\'m ready!')
}
Bot.event(bot, 'onReady')

;(bot as any).ping = async (ctx: Ctx.Text) => {
	await ctx.send('Pong!')
}
Bot.textCommand()(bot, 'ping')

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.run(TOKEN)
