"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSlash_1 = require("./BaseSlash");
/**
 * @template ArgTypeList
 * TypeScript treats `[...Array<A>, ...Array<B>]` as `Array<A | B>`, \
 * so cannot restrict cases like `[OptionalSlashArgType, PureSlashArgType]`.
 */
class Slash extends BaseSlash_1.default {
    constructor(option) {
        super({ bot: option.bot, interaction: option.interaction });
        this.command = option.command;
        this.type = 'slash';
    }
}
exports.default = Slash;
