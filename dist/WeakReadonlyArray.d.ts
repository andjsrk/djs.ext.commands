export default class WeakReadonlyArray<T = any> {
    #private;
    constructor(length: number);
    constructor(...items: Array<T>);
    readonly [index: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
    get length(): number;
}
