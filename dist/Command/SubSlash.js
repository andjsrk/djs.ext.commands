"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSlash_1 = require("./BaseSlash");
class SubSlash extends BaseSlash_1.default {
    constructor(option) {
        super({
            name: option.name,
            aliases: option.aliases,
            description: option.description,
            argDefinitions: option.argDefinitions,
            callback: option.callback,
        });
        if (typeof option.for !== 'string') {
            throw new TypeError('type of for is not string');
        }
        else if (option.mainCommand.noSubCommand) {
            throw new Error(`command '${option.for}' cannot have sub command. if you want to have sub command, set 'noSubCommand' option to false.`);
        }
        else {
            this.for = option.for;
            this.mainCommand = option.mainCommand;
            this.type = 'subSlash';
        }
    }
    toRawArray() {
        return [this.name, ...this.aliases].map(alias => ({
            type: 'SUB_COMMAND',
            name: alias,
            description: this.description ?? '-',
            options: [
                ...this.argDefinitions.map(argPiece => {
                    const argType = argPiece.type;
                    return {
                        type: argType.replace(/\?$/, '').toUpperCase(),
                        name: argPiece.name,
                        description: argPiece.description ?? '-',
                        required: !argType.endsWith('?'),
                    };
                }),
            ],
        }));
    }
}
exports.default = SubSlash;
