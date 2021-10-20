import type { ApplicationCommandData, ApplicationCommandOptionType } from 'discord.js'
import BaseSlash from './BaseSlash'
import type { BaseSlashCommandInitOption } from './BaseSlash'
import SubSlash from './SubSlash'
import type * as Ctx from '../Ctx'

export interface SlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.Slash> {
	readonly noSubCommand: boolean | undefined
}
export default class Slash extends BaseSlash<Ctx.Slash> {
	public readonly noSubCommand: boolean
	public readonly subCommands: Array<SubSlash>
	public override readonly type = 'slash'
	constructor(option: SlashCommandInitOption) {
		super({
			name: option.name,
			aliases: option.aliases,
			description: option.description,
			argDefinitions: option.argDefinitions,
			callback: option.callback,
		})
		if (option.noSubCommand !== undefined && typeof option.noSubCommand !== 'boolean') {
			throw new TypeError('type of noSubCommand is not boolean')
		} else {
			this.noSubCommand = option.noSubCommand ?? true
			this.subCommands = []
		}
	}
	public addSubCommand(subCommand: SubSlash): void {
		if (!(subCommand instanceof SubSlash)) {
			throw new TypeError('type of subCommand is not SubSlashCommand')
		} else {
			this.subCommands.push(subCommand)
		}
	}
	public toRawArray(): Array<ApplicationCommandData> {
		return [ this.name, ...this.aliases ].map(alias => ({
			name: alias,
			description: this.description ?? '-',
			options: [
				...this.subCommands.map(subCommand => subCommand.toRawArray()).flat(1),
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
