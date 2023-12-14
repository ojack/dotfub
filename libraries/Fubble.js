// TODO: implement bounds (instead of min/max)
// this.bounds.x = [0, 100] user can set
// this.bounds.t = [0, 1000]  user can not set (should be calculated)
// add bounds to constructor

/*

const f = new Fubble({
  metadata: {},
  columns: ['z'],
  bounds: {
    x: [0, 100],
    x: { min: 0, max: 100 }
    y: [0, 100],
    z: [0, 100]
  }
})

f.bounds.x.min
f.min.x
*/
class Fubble {
  constructor ({ metadata = {}, columns = [], bounds = {} } = {}) {
    this.metadata = Object.assign({
      version: '1.0.0',
      license: 'GPLv3'
    }, metadata)

    // setup columns, defaults to t, x, and y.
    // later we can add a flag for renaming or removing x and y
    this.data = { t: [], x: [], y: [] }
    columns.forEach((col) => {
      this.data[col] = []
    })

    // setup bounds
    this.bounds = { t: {}, x: {}, y: {} }
    Object.entries(bounds).map(([key, value]) => {
      if (typeof this.data[key] === 'undefined') {
        this.data[key] = []
      }
      // todo: type validation or Object.assign() w/defaults
      // setup min/max
      this.bounds[key] = value
    })

    // if (typeof arg === 'string' && this.stringToFubble) {
    //   this.stringToFubble()
    // }
  }
}

export default Fubble
