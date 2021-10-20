/* eslint-disable
    @typescript-eslint/consistent-type-imports,
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-member-accessibility,
    @typescript-eslint/member-ordering
 */
import { Intents } from 'discord.js'
import { Bot, Ctx } from '../..'
import { TOKEN } from './private'

class MyBot extends Bot {
	@Bot.textCommand({ name: 'wait-react' })
	async waitReact(ctx: Ctx.Text<[]>) {
		const sentReply = await ctx.reply('반응 기다리는 중...')
		const waitRes = await ctx.bot.waitFor('messageReactionAdd', { check: (_, user) => user.id === ctx.user.id })
		await sentReply.edit(`${waitRes[0].emoji}로 반응하셨네요.`)
	}
}

const bot = new MyBot({
	intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.run(TOKEN)
