export default class WeakReadonlyArray<T> {
	protected readonly _array: Array<T>
	constructor(length: number)
	constructor(...items: Array<T>)
	constructor(lengthOrStartOfItems: number | T, ...items: Array<T>) {
		if (typeof lengthOrStartOfItems === 'number') {
			this._array = new Array<T>(lengthOrStartOfItems)
		} else {
			this._array = [ lengthOrStartOfItems, ...items ]
		}
		for (let i = 0; i < this._array.length; i++) {
			const iInIteration = i
			if (iInIteration in this._array) { // must consider case that the index is empty
				Object.defineProperty(this, iInIteration, {
					get: () => this._array[iInIteration],
				})
			}
		}
	}
	// eslint-disable-next-line no-undef
	readonly [index: number]: T // help me, typescript-eslint
	public [Symbol.iterator](): Iterator<T> {
		return this._array[Symbol.iterator]()
	}
	public get length(): number {
		return this._array.length
	}
}
