"use strict"

var assert = require('assert');
var RadixTree = require('../lib/RadixTree')

describe('A Radix Tree', function() {
	let testRadixTree = null
	let strongCarrots = {
		title: "Strong Carrots",
		url: "http://thing.com/carrots",
		frequency: 100
	}
	let effervescentCarrots = {
		title: "Effervescent Carrots",
		url: "http://thing.com/bright",
		frequency: 23
	}
	let strongAlive = {
		title: "Strong Alive",
		url: "http://thing.com/live",
		frequency: 44
	}

	beforeEach(function() {
		testRadixTree = new RadixTree((record) => record.title.toLowerCase().split(" "))
		testRadixTree.add(strongCarrots)
		testRadixTree.add(effervescentCarrots)
		testRadixTree.add(strongAlive)
	})

	it('should allow checking of contents by key', function () {
		assert.deepEqual([strongCarrots, strongAlive], testRadixTree.getAllMatchingKey("strong"))
		assert.deepEqual([strongCarrots, effervescentCarrots], testRadixTree.getAllMatchingKey("carrots"))
	});
});