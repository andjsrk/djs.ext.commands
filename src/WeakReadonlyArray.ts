export default class WeakReadonlyArray <T = any> {
	protected readonly _array: Array<T>
	constructor(length: number)
	constructor(...items: Array<T>)
	constructor(lengthOrStartOfItems: number | T, ...items: Array<T>) {
		if (typeof lengthOrStartOfItems === 'number') {
			this._array = new Array(lengthOrStartOfItems)
		} else {
			this._array = [ lengthOrStartOfItems, ...items ]
		}
		for (let i = 0; i < this._array.length; i++) {
			const iInIteration = i
			if (iInIteration in this._array) { // must consider case that the index is empty
				Object.defineProperty(this, iInIteration, {
					get: () => {
						return this._array[iInIteration]
					},
				})
			}
		}
	}
	readonly [index: number]: T
	public [Symbol.iterator]() {
		return this._array[Symbol.iterator]()
	}
	public get length() {
		return this._array.length
	}
}
