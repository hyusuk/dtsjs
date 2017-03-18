class Row {
  constructor (features, target) {
    this.features = features
    this.target = target
  }
}

class Node {
  constructor ({left = null, right = null, splitValue = null,
                splitFeatureName = null, splitType = 'categorical'} = {}) {
    this.left = left
    this.right = right
    this.splitValue = splitValue
    this.splitFeatureName = splitFeatureName
    this.splitType = splitType
  }

  mostCommon (operation = 'lr') {
    let arr = []
    if (this.left instanceof Node || this.right instanceof Node) {
      return null
    }
    if (operation.indexOf('l') > -1 && this.left !== null) {
      arr = arr.concat(this.left)
    }
    if (operation.indexOf('r') > -1 && this.right !== null) {
      arr = arr.concat(this.right)
    }
    if (arr.length === 0) {
      return null
    }
    return arr.sort((a, b) =>
      arr.filter(v => v.target === a.target).length - arr.filter(v => v.target === b.target).length
    ).pop().target
  }

  allTheSame (operation = 'l') {
    let branch
    if (operation === 'l') {
      branch = this.left
    } else {
      branch = this.right
    }
    return branch.map(row => row.target).filter((target, i, self) => {
      return i === self.indexOf(target)
    }).length === 1
  }

  asJSON () {
    return {
      splitFeatureName: this.splitFeatureName,
      splitValue: this.splitValue,
      splitType: this.splitType,
      left: this.left instanceof Node ? this.left.asJSON() : this.left,
      right: this.right instanceof Node ? this.right.asJSON() : this.right
    }
  }
}

const criterions = {
  entropy (dataArr, allTargets) {
    let entropy = 0.0
    for (let target of allTargets) {
      for (let data of dataArr) {
        if (data.length === 0) continue
        const proportion = data.filter(row => row.target === target).length / data.length
        if (proportion === 0) continue
        entropy -= proportion * Math.log(proportion)
      }
    }
    return entropy
  }
}

class TreeBuilder {
  constructor ({maxDepth = 100, minSamplesLeaf = 1} = {}) {
    this.maxDepth = maxDepth
    this.minSamplesLeaf = minSamplesLeaf

    this._allTargets = []
  }

  testSplitData (data, featureName, splitValue) {
    let left = []
    let right = []
    for (let row of data) {
      if (typeof splitValue === 'number') {
        if (row.features[featureName] < splitValue) {
          left.push(row)
        } else {
          right.push(row)
        }
      } else {
        if (row.features[featureName] === splitValue) {
          left.push(row)
        } else {
          right.push(row)
        }
      }
    }
    return [left, right]
  }

  splitData (data) {
    let bFeatureName = null
    let bSplitValue = null
    let bScore = Infinity
    let bDataArr = null
    let bSplitType = 'categorical'
    for (let row of data) {
      for (let k in row.features) {
        const dataArr = this.testSplitData(data, k, row.features[k])
        const entropy = criterions.entropy(dataArr, this._allTargets)
        if (entropy < bScore) {
          bFeatureName = k
          bSplitValue = row.features[k]
          bScore = entropy
          bDataArr = dataArr
          bSplitType = typeof bSplitValue === 'number' ? 'numerical' : 'categorical'
        }
      }
    }
    return new Node({
      left: bDataArr[0],
      right: bDataArr[1],
      splitFeatureName: bFeatureName,
      splitValue: bSplitValue,
      splitType: bSplitType
    })
  }

  _build (node, depth) {
    if (node.left === null || node.right === null ||
        node.left.length === 0 || node.right.length === 0) {
      node.left = node.right = node.mostCommon('lr')
      return
    }
    if (depth >= this.maxDepth) {
      node.left = node.mostCommon('l')
      node.right = node.mostCommon('r')
      return
    }
    if (node.left.length <= this.minSamplesLeaf || node.allTheSame('l')) {
      node.left = node.mostCommon('l')
    } else {
      node.left = this.splitData(node.left)
      this._build(node.left, depth + 1)
    }
    if (node.right.lenfth <= this.minSamplesLeaf || node.allTheSame('r')) {
      node.right = node.mostCommon('r')
    } else {
      node.right = this.splitData(node.right)
      this._build(node.right, depth + 1)
    }
  }

  build (data) {
    this._allTargets = data.map(row => row.target).filter((target, i, self) => {
      return i === self.indexOf(target)
    })
    let node = this.splitData(data)
    this._build(node, 0)
    return node
  }
}

class DecisionTreeClassifier {
  constructor ({maxDepth = 100, minSamplesLeaf = 1} = {}) {
    this.maxDepth = maxDepth
    this.minSamplesLeaf = minSamplesLeaf

    this._tree = null
  }

  _Xy2data (X, y) {
    let data = []
    for (let i in X) {
      const x = X[i]
      let features = {}
      if (Array.isArray(x)) {
        for (let j in x) {
          features[j] = x[j]
        }
      } else {
        features = x
      }
      data.push(new Row(features, y[i]))
    }
    return data
  }

  _checkFitted () {
    if (this._tree) return true
    throw Error('Not fitted yet.')
  }

  fit (X, y) {
    const data = this._Xy2data(X, y)
    const builder = new TreeBuilder()
    this._tree = builder.build(data)
    return this
  }

  predictOne (x) {
    this._checkFitted()
    // clone tree as node
    let node = Object.assign(Object.create(this._tree), this._tree)
    while (true) {
      if (node instanceof Node) {
        if (x[node.splitFeatureName] < node.splitValue) {
          node = node.left
        } else {
          node = node.right
        }
      } else {
        return node
      }
    }
  }

  predict (X) {
    return X.map(x => this.predictOne(x))
  }

  exportTreeAsJSON () {
    this._checkFitted()
    return this._tree.asJSON()
  }
}

module.exports.Row = Row
module.exports.Node = Node
module.exports.criterions = criterions
module.exports.TreeBuilder = TreeBuilder
module.exports.DecisionTreeClassifier = DecisionTreeClassifier
