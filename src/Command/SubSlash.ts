import { ApplicationCommandSubCommandData, ApplicationCommandOptionType } from 'discord.js'
import BaseSlash, { BaseSlashCommandInitOption } from './BaseSlash'
import Slash from './Slash'
import * as Ctx from '../Ctx'

export interface SubSlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.SubSlash> {
	readonly for: string
	readonly mainCommand: Slash
}
export default class SubSlash extends BaseSlash<Ctx.SubSlash> {
	public readonly for: string
	public readonly mainCommand: Slash
	constructor(option: SubSlashCommandInitOption) {
		super({
			bot: option.bot,
			name: option.name,
			aliases: option.aliases,
			description: option.description,
			argDefinitions: option.argDefinitions,
			callback: option.callback,
		})
		if (typeof option.for !== 'string') {
			throw new TypeError('type of for is not string')
		} else if (option.mainCommand.noSubCommand) {
			throw new Error(`command '${option.for}' cannot have sub command. if you want to have sub command, set 'noSubCommand' option to false.`)
		} else {
			this.for = option.for
			this.mainCommand = option.mainCommand
		}
	}
	public readonly type = 'subSlash'
	public toRawArray(): Array<ApplicationCommandSubCommandData> {
		return [ this.name, ...this.aliases ].map(aliase => ({
			type: 'SUB_COMMAND' as 'SUB_COMMAND',
			name: aliase,
			description: this.description ?? '-',
			options: [
				...this.argDefinitions.map(argPiece => {
					const argType = argPiece.type
					return {
						type: argType.replace(/\?$/, '').toUpperCase() as Exclude<ApplicationCommandOptionType, 'SUB_COMMAND' | 'SUB_COMMAND_GROUP'>,
						name: argPiece.name,
						description: argPiece.description ?? '-',
						required: !argType.endsWith('?')
					}
				})
			],
		}))
	}
}
