"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSlash_1 = require("./BaseSlash");
const SubSlash_1 = require("./SubSlash");
class Slash extends BaseSlash_1.default {
    constructor(option) {
        super({
            name: option.name,
            aliases: option.aliases,
            description: option.description,
            argDefinitions: option.argDefinitions,
            callback: option.callback,
        });
        this.type = 'slash';
        if (option.noSubCommand !== undefined && typeof option.noSubCommand !== 'boolean') {
            throw new TypeError('type of noSubCommand is not boolean');
        }
        else {
            this.noSubCommand = option.noSubCommand ?? true;
            this.subCommands = [];
        }
    }
    addSubCommand(subCommand) {
        if (!(subCommand instanceof SubSlash_1.default)) {
            throw new TypeError('type of subCommand is not SubSlashCommand');
        }
        else {
            this.subCommands.push(subCommand);
        }
    }
    toRawArray() {
        return [this.name, ...this.aliases].map(aliase => ({
            name: aliase,
            description: this.description ?? '-',
            options: [
                ...this.subCommands.map(subCommand => subCommand.toRawArray()).flat(1),
                ...this.argDefinitions.map(argPiece => {
                    const argType = argPiece.type;
                    return {
                        type: argType.replace(/\?$/, '').toUpperCase(),
                        name: argPiece.name,
                        description: argPiece.description ?? '-',
                        required: !argType.endsWith('?')
                    };
                })
            ]
        }));
    }
}
exports.default = Slash;
