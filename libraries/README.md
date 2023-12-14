# the Fubble API


## Fubble Constructor

The Fubble constructor can be used to create new fubble instances. It returns an object with a `metadata`, `bounds` and `data` properties, where `data` is an object containing all of the Fubble's dimensions stored as properties. The first of which must always be `t` (time of tick). By default the Fubble will also include an `x` and `y` dimension as well.
```js
const f = new Fubble()

f.metadata.version // fubble version
f.data.t[0] // time value of first tick (must always be 0)
f.data.x[0] // x value of first tick
// min/max bounds for the x dimension
f.bounds.x.min
f.bounds.y.max
```

You can add your own metadata as well as additional dimensions by passing these into the constructor. **NOTE:** Once a fubble is instantiated it's dimensions can not be changed.
```js
const f = new Fubble({
  metadata: { location: 'outer space' },
  dimensions: ['z']
})

f.data.z[0] // z value of first tick
```

You can also specify the bounds manually in the constructor, which can also be used to create new dimensions.
```js
const f = new Fubble({
  metadata: { location: 'outer space' },
  bounds: {
    x: { min: 0, max: 1000 }
    y: { min: 0, max: 1000 }
    z: { min: 0, max: 1000 }
  }
})
```

## Fubble Actions

### addTick()

```js
const fubble = new Fubble()
fubble.addTick({ t: 1, x: 100, y: 100 })
```

// should always have time, should add new time such that time array is always increasing
