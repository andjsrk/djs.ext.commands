export interface IReadonlyMap<K = any, V = any> {
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    readonly size: number;
}
declare const ReadonlyMap: new <K = any, V = any>(map: Map<K, V>) => IReadonlyMap<K, V>;
export default ReadonlyMap;
