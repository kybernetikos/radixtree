"use strict"

module.exports =
class RadixTreeNode {
	constructor() {
		this.terminatingRecords = []
		this.children = new Map()
	}

	add(remainingRecordKey, record) {
		var destinationNode = this._getNode(remainingRecordKey, WHEN_NOT_FOUND_CREATE)
		destinationNode.terminatingRecords.push(record)
	}

	has(remainingRecordKey, record) {
		var foundNode = this._getNode(remainingRecordKey, WHEN_NOT_FOUND_RETURN_NULL)
		if (foundNode !== null) {
			if (record === undefined) {
				return true
			}
			return foundNode.terminatingRecords.indexOf(record) >= 0
		}
		return false
	}

	getAllMatching(remainingRecordKey) {
		var foundNode = this._getNode(remainingRecordKey, WHEN_NOT_FOUND_RETURN_NULL)
		if (foundNode === null) {
			return []
		}
		return foundNode.terminatingRecords
	}

	getAllByPrefix(remainingRecordKey, limit) {
		var foundNode = this._getNode(remainingRecordKey, WHEN_NOT_FOUND_RETURN_CHILD)
		if (foundNode === null) {
			return []
		}
		return foundNode._populateWithSubtree([], limit)
	}

	toString(pathSoFar) {
		pathSoFar = pathSoFar || ""
		let result = [
			"Path: " + pathSoFar,
			"Records: ", this.terminatingRecords.join(", "),
			""
		]
		for (let kv of this.children) {
			let key = kv[0], value = kv[1]
			result.push(key.toString(pathSoFar + "."  + value))
		}
		return result.join("\n")
	}

	_populateWithSubtree(destination, limit) {
		if (limit !== undefined && destination.length >= limit) {
			return destination
		}

		destination.push(...this.terminatingRecords)
		for (var kv of this.children) {
			let value = kv[1]
			value._populateWithSubtree(destination)
		}

		if (limit !== undefined && destination.length >= limit) {
			destination.splice(limit, destination.length - limit)
		}
		return destination
	}

	_getNode(remainingRecordKey, notFoundAction) {
		if (remainingRecordKey.length === 0) {
			return this
		}
		let startElement = remainingRecordKey[0]
		for (let keyVal of this.children) {
			let key = keyVal[0], childNode = keyVal[1]
			if (key[0] === startElement) {
				let commonPrefixLength = longestPrefixLength(key, remainingRecordKey)
				let commonPrefix = key.substring(0, commonPrefixLength)
				let remainingNodeKey = key.substring(commonPrefixLength)
				let newRemainingRecordKey = remainingRecordKey.substring(commonPrefixLength)
				if (commonPrefixLength < key.length) {
					if (notFoundAction === WHEN_NOT_FOUND_CREATE) {
						this.children.delete(key)
						var newParent = new RadixTreeNode()
						newParent.children.set(remainingNodeKey, childNode)
						this.children.set(commonPrefix, newParent)
						childNode = newParent
					} else if (notFoundAction === WHEN_NOT_FOUND_RETURN_CHILD) {
						return childNode
					} else if (notFoundAction === WHEN_NOT_FOUND_RETURN_PARENT) {
						return this
					} else {
						return null
					}
				}
				return childNode._getNode(newRemainingRecordKey, notFoundAction)
			}
		}
		if (notFoundAction === WHEN_NOT_FOUND_CREATE) {
			let destination = new RadixTreeNode()
			this.children.set(remainingRecordKey, destination)
			return destination
		} else if (notFoundAction === WHEN_NOT_FOUND_RETURN_PARENT) {
			return this
		}
		return null
	}
}

function longestPrefixLength(a, b) {
	var checkingLength = Math.min(a.length, b.length)
	for (var i = 0; i < checkingLength; ++i) {
		if (a[i] !== b[i]) {
			return i
		}
	}
	return checkingLength
}

var WHEN_NOT_FOUND_CREATE = 0
var WHEN_NOT_FOUND_RETURN_CHILD = 1  // might still be null, if there aren't any children
var WHEN_NOT_FOUND_RETURN_PARENT = 2
var WHEN_NOT_FOUND_RETURN_NULL = 3