dtsjs    [![Build Status](https://travis-ci.org/hyusuk/dtsjs.svg?branch=master)](https://travis-ci.org/hyusuk/dtsjs)
=====

dtsjs(Decision Trees JS) is an implementation of ID3 decision tree algorithm.
This works in both browser and NodeJS.


Demo
====
https://hyusuk.github.io/dtsjs/


Usage
=====

```javascript
<script src="./dist/dts.js"></script>
<script>
  var X = [
    {a: 1, b: 1},
    {a: 1, b: 2},
    {a: 2, b: 3},
    {a: 3, b: 2},
    {a: 3, b: 3}
  ];
  var y = [0, 0, 1, 1, 1];
  var clf = new dtsjs.DecisionTreeClassifier({
    minSamplesLeaf: 1,
    maxDepth: 100
  });
  // Fit tree to training samples
  clf.fit(X, y);
  // Predict class labels
  clf.predict(X); // return [0, 0, 1, 1, 1]
  
  // You can also export the fitted tree as JSON
  clf.exportTreeAsJSON()
</script>
```

Here, `X` is the NxD training input samples and `y` is the class labels.


LICENSE
=======
MIT
