import Base from './Base';
import type { BaseCommandInitOption } from './Base';
import type * as Ctx from '../Ctx';
import type { TextArgTypeList } from '../Ctx/Text';
export interface TextCommandInitOption extends BaseCommandInitOption {
    readonly argTypes: TextArgTypeList | undefined;
    readonly callback: (ctx: Ctx.Text) => void;
}
export default class Text<ArgTypeList extends TextArgTypeList = TextArgTypeList> extends Base {
    readonly argTypes: ArgTypeList;
    callback: (ctx: Ctx.Text<ArgTypeList>) => void;
    readonly type: "text";
    constructor(option: TextCommandInitOption);
}
