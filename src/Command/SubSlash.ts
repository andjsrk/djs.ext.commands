import type { ApplicationCommandOptionType, ApplicationCommandSubCommandData } from 'discord.js'
import BaseSlash from './BaseSlash'
import type { BaseSlashCommandInitOption } from './BaseSlash'
import type Slash from './Slash'
import type * as Ctx from '../Ctx'

export interface SubSlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.SubSlash> {
	readonly for: string
	readonly mainCommand: Slash
}
export default class SubSlash extends BaseSlash<Ctx.SubSlash> {
	public readonly for: string
	public readonly mainCommand: Slash
	public override readonly type = 'subSlash'
	constructor(option: SubSlashCommandInitOption) {
		super({
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
	public toRawArray(): Array<ApplicationCommandSubCommandData> {
		return [ this.name, ...this.aliases ].map(alias => ({
			type: 'SUB_COMMAND' as 'SUB_COMMAND',
			name: alias,
			description: this.description ?? '-',
			options: [
				...this.argDefinitions.map(argPiece => {
					const argType = argPiece.type
					return {
						type: argType.replace(/\?$/, '').toUpperCase() as Exclude<ApplicationCommandOptionType, 'SUB_COMMAND' | 'SUB_COMMAND_GROUP'>,
						name: argPiece.name,
						description: argPiece.description ?? '-',
						required: !argType.endsWith('?'),
					}
				}),
			],
		}))
	}
}
