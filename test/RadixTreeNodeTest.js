"use strict"

var assert = require('assert');
var RadixTreeNode = require('../lib/RadixTreeNode')

describe('A Radix Tree Node', function() {
	let testRadixTreeNode = null

	beforeEach(function() {
		testRadixTreeNode = new RadixTreeNode()

		testRadixTreeNode.add("bobisgreat", "hi")
		testRadixTreeNode.add("bobisgreat", "bye")
		testRadixTreeNode.add("bob", "a person")
		testRadixTreeNode.add("bo", "another person")
		testRadixTreeNode.add("bobis", "wonderful")
		testRadixTreeNode.add("bobis", "amazing")
	})

	it('should allow checking of contents', function () {
		assert.equal(false, testRadixTreeNode.has("jim"))
		assert.equal(false, testRadixTreeNode.has("jim"))
		assert.equal(false, testRadixTreeNode.has("bobisnt"))
		assert.equal(false, testRadixTreeNode.has("bobisgreater"))
		assert.equal(true, testRadixTreeNode.has("bobisgreat"))
		assert.equal(true, testRadixTreeNode.has("bob"))
		assert.equal(true, testRadixTreeNode.has("bo"))
		assert.equal(true, testRadixTreeNode.has("bobis"))
		assert.equal(true, testRadixTreeNode.has("bobis", "wonderful"))
		assert.equal(true, testRadixTreeNode.has("bobis", "amazing"))
		assert.equal(false, testRadixTreeNode.has("bobis", "genius"))
	});

	it('should allow retreival of exact matches', function() {
		assert.deepEqual(["wonderful", "amazing"], testRadixTreeNode.getAllMatching("bobis"))
		assert.deepEqual(["hi", "bye"], testRadixTreeNode.getAllMatching("bobisgreat"))
		assert.deepEqual(["another person"], testRadixTreeNode.getAllMatching("bo"))
		assert.deepEqual([], testRadixTreeNode.getAllMatching("b"))
		assert.deepEqual([], testRadixTreeNode.getAllMatching("box"))
	})

	it('should allow retreival of prefix matches', function() {
		assert.deepEqual(["wonderful", "amazing", "hi", "bye"], testRadixTreeNode.getAllByPrefix("bobis"))
		assert.deepEqual(["wonderful", "amazing", "hi"], testRadixTreeNode.getAllByPrefix("bobis", 3))
		assert.deepEqual(["wonderful"], testRadixTreeNode.getAllByPrefix("bobis", 1))
		assert.deepEqual(["hi", "bye"], testRadixTreeNode.getAllByPrefix("bobisgr"))
	})
});