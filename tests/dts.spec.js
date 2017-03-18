const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const dtsjs = require('../src/dts')

describe('criterions', function () {
  const data = [
    new dtsjs.Row({a: 1, b: 1}, 0),
    new dtsjs.Row({a: 1, b: 2}, 0),
    new dtsjs.Row({a: 2, b: 3}, 1),
    new dtsjs.Row({a: 3, b: 2}, 1),
    new dtsjs.Row({a: 3, b: 3}, 1)
  ]

  describe('entropy', function () {
    it('should return entropy', function () {
      assert.ok(Math.abs(dtsjs.criterions.entropy([data], [0, 1]) - 0.67) < 0.01)
    })
  })
})

describe('Node', function () {
  const data = [
    new dtsjs.Row({a: 1, b: 1}, 0),
    new dtsjs.Row({a: 1, b: 2}, 0),
    new dtsjs.Row({a: 2, b: 3}, 1),
    new dtsjs.Row({a: 3, b: 2}, 1),
    new dtsjs.Row({a: 3, b: 3}, 1)
  ]

  describe('mostCommon', function () {
    it('should return most common element in a branch', function () {
      const node = new dtsjs.Node({left: [], right: data})
      assert.equal(node.mostCommon('l') === null, true)
      assert.equal(node.mostCommon('r'), 1)
    })
  })

  describe('allTheSame', function () {
    it('should return if target values in branch are same', function () {
      const node = new dtsjs.Node({left: [data.slice(0, 2)], right: []})
      assert.equal(node.allTheSame('l'), true)
    })
  })
})

describe('TreeBuilder', function () {
  const data = [
    new dtsjs.Row({a: 1, b: 1}, 0),
    new dtsjs.Row({a: 1, b: 2}, 0),
    new dtsjs.Row({a: 2, b: 3}, 1),
    new dtsjs.Row({a: 3, b: 2}, 1),
    new dtsjs.Row({a: 3, b: 3}, 1)
  ]

  describe('testSplitData', function () {
    it('should split an array of data into two  by the feature value', function () {
      const builder = new dtsjs.TreeBuilder()
      assert.deepEqual(
        builder.testSplitData(data, 'a', 1.5),
        [data.slice(0, 2), data.slice(2, 5)]
      )
    })
  })

  describe('splitData', function () {
    it('should return the best split point for a data', function () {
      const builder = new dtsjs.TreeBuilder()
      builder._allTargets = [0, 1]
      const node = builder.splitData(data)
      assert.equal(node.splitFeatureName, 'a')
      assert.equal(node.splitValue, 2)
      assert.deepEqual(node.left, data.slice(0, 2))
      assert.deepEqual(node.right, data.slice(2, 5))
    })
  })

  describe('build', function () {
    it('should build decision tree', function () {
      const builder = new dtsjs.TreeBuilder()
      assert.deepEqual(builder.build(data), new dtsjs.Node({
        left: 0,
        right: 1,
        splitValue: 2,
        splitFeatureName: 'a',
        splitType: 'numerical'
      }))
    })
  })
})

describe('DecisionTreeClassifier', function () {
  const X = [
    {a: 1, b: 1},
    {a: 1, b: 2},
    {a: 2, b: 3},
    {a: 3, b: 2},
    {a: 3, b: 3}
  ]
  const y = [0, 0, 1, 1, 1]

  describe('predict', function () {
    it('should return predicted classes', function () {
      const clf = new dtsjs.DecisionTreeClassifier()
      clf.fit(X, y)
      assert.deepEqual(clf.predict(X), [0, 0, 1, 1, 1])
    })
  })
})
