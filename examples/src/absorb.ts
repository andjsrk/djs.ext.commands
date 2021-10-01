import { Bot } from '../..'
import ValueCommand from './absorb-source-value'
import { TOKEN } from './private'

class MyBot extends Bot {
	@Bot.event
	async onReady() {
		console.log('I\'m ready!')
	}
}

const bot = new MyBot({ prefix: '!' })

;(async () => {
	bot.absorbCommandsSyncByPath('absorb-source-path.ts')
	bot.absorbCommands(ValueCommand)
	bot.run(TOKEN)
})()
