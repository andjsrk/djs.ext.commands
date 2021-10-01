import Base, { BaseCommandInitOption } from './Base';
import * as Ctx from '../Ctx';
import { TextArgTypeList } from '../Ctx/Text';
export interface TextCommandInitOption extends BaseCommandInitOption {
    readonly argTypes: TextArgTypeList | undefined;
    readonly callback: (ctx: Ctx.Text) => any;
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
    readonly argTypes: ArgTypeList;
    callback: (ctx: Ctx.Text<ArgTypeList>) => any;
    constructor(option: TextCommandInitOption);
    readonly type = "text";
}
