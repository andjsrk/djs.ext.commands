export interface IReadonlyMap<K = any, V = any> {
	[Symbol.iterator](): IterableIterator<[ K, V ]>
	entries(): IterableIterator<[ K, V ]>
	get(key: K): V | undefined
	has(key: K): boolean
	keys(): IterableIterator<K>
	values(): IterableIterator<V>
	readonly size: number
}

const ReadonlyMap: new <K = any, V = any>(map: Map<K, V>) => IReadonlyMap<K, V> = class <K = any, V = any> {
	#map: Map<K, V>
	constructor(map: Map<K, V>) {
		this.#map = map
	}
	public [Symbol.iterator]() {
		return this.#map[Symbol.iterator]()
	}
	public entries() {
		return this.#map.entries()
	}
	public get(key: K) {
		return this.#map.get(key)
	}
	public has(key: K) {
		return this.#map.has(key)
	}
	public keys() {
		return this.#map.keys()
	}
	public values() {
		return this.#map.values()
	}
	public get size() {
		return this.#map.size
	}
}
export default ReadonlyMap
