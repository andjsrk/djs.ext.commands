import { ApplicationCommandData, ApplicationCommandOptionType } from 'discord.js'
import BaseSlash, { BaseSlashCommandInitOption } from './BaseSlash'
import SubSlash from './SubSlash'
import * as Ctx from '../Ctx'

export interface SlashCommandInitOption extends BaseSlashCommandInitOption<Ctx.Slash> {
	readonly noSubCommand: boolean | undefined
}
export default class Slash extends BaseSlash<Ctx.Slash> {
	public readonly noSubCommand: boolean
	public readonly subCommands: Array<SubSlash>
	constructor(option: SlashCommandInitOption) {
		super({
			bot: option.bot,
			name: option.name,
			aliases: option.aliases,
			description: option.description,
			argDefinitions: option.argDefinitions,
			callback: option.callback,
		})
		if (option.noSubCommand !== undefined && typeof option !== 'boolean') {
			throw new TypeError('type of noSubCommand is not boolean')
		} else {
			this.noSubCommand = option.noSubCommand ?? true
			this.subCommands = []
		}
	}
	public readonly type = 'slash'
	public addSubCommand(subCommand: SubSlash) {
		if (!(subCommand instanceof SubSlash)) {
			throw new TypeError('type of subCommand is not SubSlashCommand')
		} else {
			this.subCommands.push(subCommand)
		}
	}
	public toRawArray(): Array<ApplicationCommandData> {
		return [ this.name, ...this.aliases ].map(aliase => ({
			name: aliase,
			description: this.description ?? '-',
			options: [
				...this.subCommands.map(subCommand => subCommand.toRawArray()).flat(1),
				...this.argDefinitions.map(argPiece => {
					const argType = argPiece.type
					return {
						type: argType.replace(/\?$/, '').toUpperCase() as Exclude<ApplicationCommandOptionType, 'SUB_COMMAND' | 'SUB_COMMAND_GROUP'>,
						name: argPiece.name,
						description: argPiece.description ?? '-',
						required: !argType.endsWith('?')
					}
				})
			]
		}))
	}
}
