export interface BaseCommandInitOption {
    readonly name: string;
    readonly aliases: Array<string> | undefined;
}
export default abstract class Base {
    readonly aliases: Array<string>;
    readonly name: string;
    abstract callback: (...args: Array<any>) => void;
    abstract readonly type: string;
    constructor(option: BaseCommandInitOption);
}
