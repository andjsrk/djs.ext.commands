/* eslint-disable
    @typescript-eslint/consistent-type-imports,
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-member-accessibility,
    @typescript-eslint/member-ordering,
	@typescript-eslint/unbound-method
 */
import { MessageActionRow, MessageButton } from 'discord.js'
import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

class MyBot extends Bot {
	@Bot.event
	async onReady() {
		console.log('I\'m ready!')
	}
	@Bot.textCommand()
	async button(ctx: Ctx.Text) {
		await ctx.send({
			content: 'Click the button!',
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('my-button')
							.setLabel('Click me!')
							.setStyle('PRIMARY'),
					),
			],
		})
	}
	@Bot.button({ customId: 'my-button' })
	async onClick(ctx: Ctx.Button) {
		await ctx.send('Clicked button!')
	}
}

const bot = new MyBot()

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.run(TOKEN)
