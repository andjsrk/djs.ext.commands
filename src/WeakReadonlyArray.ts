export default class WeakReadonlyArray <T = any> {
	#array: Array<T>
	constructor(length: number)
	constructor(...items: Array<T>)
	constructor(lengthOrStartOfItems: number | T, ...items: Array<T>) {
		if (typeof lengthOrStartOfItems === 'number') {
			this.#array = new Array(lengthOrStartOfItems)
		} else {
			this.#array = [ lengthOrStartOfItems, ...items ]
		}
		for (let i = 0; i < this.#array.length; i++) {
			const iInIteration = i
			if (iInIteration in this.#array) { // must consider case that the index is empty
				Object.defineProperty(this, iInIteration, {
					get: () => {
						return this.#array[iInIteration]
					},
					writable: false,
				})
			}
		}
	}
	readonly [index: number]: T
	public [Symbol.iterator]() {
		return this.#array[Symbol.iterator]()
	}
	public get length() {
		return this.#array.length
	}
}
