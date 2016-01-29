"use strict"

let RadixTreeNode = require('./RadixTreeNode')

module.exports =
class RadixTree {
	constructor(keyFn) {
		this._root = new RadixTreeNode()
		this._keyFn = keyFn
	}

	add(record) {
		let keys = this._keyFn(record)
		for (let key of keys) {
			this._root.add(key, record)
		}
	}

	getAllMatchingKey(key) {
		return this._root.getAllMatching(key)
	}
}