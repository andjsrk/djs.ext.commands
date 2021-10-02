# djs.ext.commands
`djs.ext.commands` is imitation of [`discord.ext.commands`](https://github.com/Rapptz/discord.py/tree/master/discord/ext/commands) written in TypeScript. \
Usages are similar to original.

## Installation
```
npm install djs.ext.commands
```

## Quick Example
```ts
import { Formatters as Format } from 'discord.js'
import { Bot, Ctx } from 'djs.ext.commands'

class MyBot extends Bot {
	@Bot.event('ready')
	async ready() {
		console.log('I\'m ready!')
	}
	@Bot.textCommand()
	async ping(ctx: Ctx.Text) {
		ctx.send('Pong!')
	}
	@Bot.slashCommand({ argDefinitions: [ { name: 'input', type: 'string' } ] })
	async get_input(ctx: Ctx.Slash<[ 'string' ]>) {
		await ctx.send(`Input: ${Format.inlineCode(ctx.args[0])}`)
	}
}

const bot = new MyBot({ prefix: '!' })

bot.run('TOKEN')
```
You can find more examples in the examples directory.

## Decorator?
Basically, JavaScript doesn't support decorator syntax. \
If you want to use decorator syntax, you should use [Babel](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) or [TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html), etc.

## Difference with discord.ext.commands

### Class syntax is recommended
Decorator syntax is only can be used in class. \
So, using class syntax is recommended. \
Without decorator syntax, you can write code like this:
```ts
import { Bot } from 'djs.ext.commands'

const bot = new Bot()

;(bot as any).onReady = () => {
	console.log('I\'m ready!')
}
Bot.event(bot, 'onReady')

;(bot as any).ping = (ctx: Ctx.Text) => {
	ctx.send('Pong!')
}
Bot.textCommand()(bot, 'ping')

bot.run('TOKEN')
```
But, as you know, this way is bad.

### No automatic argument parsing without `argTypes`/`argDefinitions` option of command
Due to limit of JavaScript, arguments of listener cannot parsed automatically. \
So, if you want parsed arguments, you should set `argTypes`/`argDefinitions` option yourself like this:
```ts
import { Bot, Ctx } from 'djs.ext.commands'

class MyBot extends Bot {
	@Bot.textCommand({ argTypes: [ 'number', 'number' ] })
	async sum(ctx: Ctx.Text<[ 'number', 'number' ]>) {
		const [ first, second ] = ctx.args
		ctx.send(`Sum of ${first} and ${second} is ${first + second}.`)
	}
}
```
