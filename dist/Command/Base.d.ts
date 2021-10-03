export interface BaseCommandInitOption {
    readonly name: string;
    readonly aliases: Array<string> | undefined;
}
export default abstract class Base {
    readonly name: string;
    readonly aliases: Array<string>;
    abstract callback: (...args: Array<any>) => any;
    constructor(option: BaseCommandInitOption);
    abstract readonly type: string;
}
