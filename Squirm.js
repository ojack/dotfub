class Squirm {
  constructor ({ metadata = {}, columns = [] } = {}) {
    this.metadata = Object.assign({
      version: "1.0.0",
      license: "GPLv3"
    }, metadata)
    // defaults to t, x, and y. later we can add a flag for renaming or removing x and y
    this.data = { t: [], x: [], y: [] }
    columns.forEach((col) => {
      this.data[col] = []
    })
  }

  set min (v) {
    console.warn('Squirm: min is a read only property')
  }

  get min () {
    const min = {}
    Object.keys(this.data).forEach(c => {
      min[c] = Math.min(...this.data[c])
    })
    return min
  }

  set max (v) {
    console.warn('Squirm: max is a read only property')
  }

  get max () {
    const max = {}
    Object.keys(this.data).forEach(c => {
      max[c] = Math.max(...this.data[c])
    })
    return max
  }
}

export default Squirm
