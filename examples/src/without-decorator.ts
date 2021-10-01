import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

const bot = new Bot({ prefix: '!' })

;(bot as any).onReady = () => {
	console.log('I\'m ready!')
}
Bot.event(bot, 'onReady')

;(bot as any).ping = (ctx: Ctx.Text) => {
	ctx.send('Pong!')
}
Bot.textCommand()(bot, 'ping')

bot.run(TOKEN)
