export default class WeakReadonlyArray<T> {
    protected readonly _array: Array<T>;
    constructor(length: number);
    constructor(...items: Array<T>);
    readonly [index: number]: T;
    [Symbol.iterator](): Iterator<T>;
    get length(): number;
}
