# QuadTree

A JavaScript implementation of a [Point Quad Tree](http://en.wikipedia.org/wiki/Quadtree)

# Examples

```javascript
var qt = new PointQuadTree();

// set a value at 10, 5
qt.set({x: 10, y: 5}, 'blue');

// get a value from 10, 5
qt.get({x: 10, y: 5}); // 'blue'

// remove a value
qt.remove({x: 10, y: 5});
```
