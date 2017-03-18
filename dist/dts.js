var dtsjs =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Row = function Row(features, target) {
  _classCallCheck(this, Row);

  this.features = features;
  this.target = target;
};

var Node = function () {
  function Node() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$left = _ref.left,
        left = _ref$left === undefined ? null : _ref$left,
        _ref$right = _ref.right,
        right = _ref$right === undefined ? null : _ref$right,
        _ref$splitValue = _ref.splitValue,
        splitValue = _ref$splitValue === undefined ? null : _ref$splitValue,
        _ref$splitFeatureName = _ref.splitFeatureName,
        splitFeatureName = _ref$splitFeatureName === undefined ? null : _ref$splitFeatureName,
        _ref$splitType = _ref.splitType,
        splitType = _ref$splitType === undefined ? 'categorical' : _ref$splitType;

    _classCallCheck(this, Node);

    this.left = left;
    this.right = right;
    this.splitValue = splitValue;
    this.splitFeatureName = splitFeatureName;
    this.splitType = splitType;
  }

  Node.prototype.mostCommon = function mostCommon() {
    var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'lr';

    var arr = [];
    if (this.left instanceof Node || this.right instanceof Node) {
      return null;
    }
    if (operation.indexOf('l') > -1 && this.left !== null) {
      arr = arr.concat(this.left);
    }
    if (operation.indexOf('r') > -1 && this.right !== null) {
      arr = arr.concat(this.right);
    }
    if (arr.length === 0) {
      return null;
    }
    return arr.sort(function (a, b) {
      return arr.filter(function (v) {
        return v.target === a.target;
      }).length - arr.filter(function (v) {
        return v.target === b.target;
      }).length;
    }).pop().target;
  };

  Node.prototype.allTheSame = function allTheSame() {
    var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'l';

    var branch = void 0;
    if (operation === 'l') {
      branch = this.left;
    } else {
      branch = this.right;
    }
    return branch.map(function (row) {
      return row.target;
    }).filter(function (target, i, self) {
      return i === self.indexOf(target);
    }).length === 1;
  };

  Node.prototype.asJSON = function asJSON() {
    return {
      splitFeatureName: this.splitFeatureName,
      splitValue: this.splitValue,
      splitType: this.splitType,
      left: this.left instanceof Node ? this.left.asJSON() : this.left,
      right: this.right instanceof Node ? this.right.asJSON() : this.right
    };
  };

  return Node;
}();

var criterions = {
  entropy: function entropy(dataArr, allTargets) {
    var entropy = 0.0;

    var _loop = function _loop() {
      if (_isArray) {
        if (_i >= _iterator.length) return 'break';
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) return 'break';
        _ref2 = _i.value;
      }

      var target = _ref2;

      for (var _iterator2 = dataArr, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref3 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref3 = _i2.value;
        }

        var data = _ref3;

        if (data.length === 0) continue;
        var proportion = data.filter(function (row) {
          return row.target === target;
        }).length / data.length;
        if (proportion === 0) continue;
        entropy -= proportion * Math.log(proportion);
      }
    };

    for (var _iterator = allTargets, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      var _ret = _loop();

      if (_ret === 'break') break;
    }
    return entropy;
  }
};

var TreeBuilder = function () {
  function TreeBuilder() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$maxDepth = _ref4.maxDepth,
        maxDepth = _ref4$maxDepth === undefined ? 100 : _ref4$maxDepth,
        _ref4$minSamplesLeaf = _ref4.minSamplesLeaf,
        minSamplesLeaf = _ref4$minSamplesLeaf === undefined ? 1 : _ref4$minSamplesLeaf;

    _classCallCheck(this, TreeBuilder);

    this.maxDepth = maxDepth;
    this.minSamplesLeaf = minSamplesLeaf;

    this._allTargets = [];
  }

  TreeBuilder.prototype.testSplitData = function testSplitData(data, featureName, splitValue) {
    var left = [];
    var right = [];
    for (var _iterator3 = data, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref5 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref5 = _i3.value;
      }

      var row = _ref5;

      if (typeof splitValue === 'number') {
        if (row.features[featureName] < splitValue) {
          left.push(row);
        } else {
          right.push(row);
        }
      } else {
        if (row.features[featureName] === splitValue) {
          left.push(row);
        } else {
          right.push(row);
        }
      }
    }
    return [left, right];
  };

  TreeBuilder.prototype.splitData = function splitData(data) {
    var bFeatureName = null;
    var bSplitValue = null;
    var bScore = Infinity;
    var bDataArr = null;
    var bSplitType = 'categorical';
    for (var _iterator4 = data, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref6 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref6 = _i4.value;
      }

      var row = _ref6;

      for (var k in row.features) {
        var dataArr = this.testSplitData(data, k, row.features[k]);
        var entropy = criterions.entropy(dataArr, this._allTargets);
        if (entropy < bScore) {
          bFeatureName = k;
          bSplitValue = row.features[k];
          bScore = entropy;
          bDataArr = dataArr;
          bSplitType = typeof bSplitValue === 'number' ? 'numerical' : 'categorical';
        }
      }
    }
    return new Node({
      left: bDataArr[0],
      right: bDataArr[1],
      splitFeatureName: bFeatureName,
      splitValue: bSplitValue,
      splitType: bSplitType
    });
  };

  TreeBuilder.prototype._build = function _build(node, depth) {
    if (node.left === null || node.right === null || node.left.length === 0 || node.right.length === 0) {
      node.left = node.right = node.mostCommon('lr');
      return;
    }
    if (depth >= this.maxDepth) {
      node.left = node.mostCommon('l');
      node.right = node.mostCommon('r');
      return;
    }
    if (node.left.length <= this.minSamplesLeaf || node.allTheSame('l')) {
      node.left = node.mostCommon('l');
    } else {
      node.left = this.splitData(node.left);
      this._build(node.left, depth + 1);
    }
    if (node.right.lenfth <= this.minSamplesLeaf || node.allTheSame('r')) {
      node.right = node.mostCommon('r');
    } else {
      node.right = this.splitData(node.right);
      this._build(node.right, depth + 1);
    }
  };

  TreeBuilder.prototype.build = function build(data) {
    this._allTargets = data.map(function (row) {
      return row.target;
    }).filter(function (target, i, self) {
      return i === self.indexOf(target);
    });
    var node = this.splitData(data);
    this._build(node, 0);
    return node;
  };

  return TreeBuilder;
}();

var DecisionTreeClassifier = function () {
  function DecisionTreeClassifier() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$maxDepth = _ref7.maxDepth,
        maxDepth = _ref7$maxDepth === undefined ? 100 : _ref7$maxDepth,
        _ref7$minSamplesLeaf = _ref7.minSamplesLeaf,
        minSamplesLeaf = _ref7$minSamplesLeaf === undefined ? 1 : _ref7$minSamplesLeaf;

    _classCallCheck(this, DecisionTreeClassifier);

    this.maxDepth = maxDepth;
    this.minSamplesLeaf = minSamplesLeaf;

    this._tree = null;
  }

  DecisionTreeClassifier.prototype._Xy2data = function _Xy2data(X, y) {
    var data = [];
    for (var i in X) {
      var x = X[i];
      var features = {};
      if (Array.isArray(x)) {
        for (var j in x) {
          features[j] = x[j];
        }
      } else {
        features = x;
      }
      data.push(new Row(features, y[i]));
    }
    return data;
  };

  DecisionTreeClassifier.prototype._checkFitted = function _checkFitted() {
    if (this._tree) return true;
    throw Error('Not fitted yet.');
  };

  DecisionTreeClassifier.prototype.fit = function fit(X, y) {
    var data = this._Xy2data(X, y);
    var builder = new TreeBuilder();
    this._tree = builder.build(data);
    return this;
  };

  DecisionTreeClassifier.prototype.predictOne = function predictOne(x) {
    this._checkFitted();
    // clone tree as node
    var node = Object.assign(Object.create(this._tree), this._tree);
    while (true) {
      if (node instanceof Node) {
        if (x[node.splitFeatureName] < node.splitValue) {
          node = node.left;
        } else {
          node = node.right;
        }
      } else {
        return node;
      }
    }
  };

  DecisionTreeClassifier.prototype.predict = function predict(X) {
    var _this = this;

    return X.map(function (x) {
      return _this.predictOne(x);
    });
  };

  DecisionTreeClassifier.prototype.exportTreeAsJSON = function exportTreeAsJSON() {
    this._checkFitted();
    return this._tree.asJSON();
  };

  return DecisionTreeClassifier;
}();

module.exports.Row = Row;
module.exports.Node = Node;
module.exports.criterions = criterions;
module.exports.TreeBuilder = TreeBuilder;
module.exports.DecisionTreeClassifier = DecisionTreeClassifier;

/***/ })
/******/ ]);
//# sourceMappingURL=dts.js.map