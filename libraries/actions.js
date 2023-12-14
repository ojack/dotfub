import Squirm from './Squirm.js'

// @todo: should always have time, should add new time such that time array is always increasing
const _addTick = (s, payload) => {
  if (typeof s.metadata.emergence === 'undefined') {
    s.metadata.emergence = new Date().toISOString()
  }

  if (typeof payload.t === 'undefined') {
    console.error('addTick: must have a {t} property for the time')
    return
  }

  let idx = null // index to insert payload between
  let rep = null // index to replace with new payload
  if (s.data.t.indexOf(payload.t) >= 0) {
    rep = s.data.t.indexOf(payload.t)
    console.warn(`addTick: {t} is already in the data, replacing index ${rep} with new tick`)
  } else if (payload.t < s.max.t) {
    let low = 0
    let high = s.data.t.length
    while (low < high) {
      const mid = Math.floor((low + high) / 2)
      if (payload.t <= s.data.t[mid]) high = mid
      else low = mid + 1
    }
    idx = low
    console.warn(`addTick: {t} passed is smaller than the last tick, inserting it into index ${idx} to keep ticks in the right order`)
  }

  Object.keys(s.data).forEach(key => {
    let newVal = payload[key]

    if (!(key in payload)) {
      // todo: defaulting to 0, think this through a bit more
      newVal = s.data[key].length === 0
        ? 0 : s.data[key][s.data[key].length - 1]
      console.warn(`missing data for ${key}, using  ${newVal} instead`)
    }

    if (typeof idx === 'number') {
      s.data[key].splice(idx, 0, newVal)
    } else if (typeof rep === 'number') {
      s.data[key][rep] = newVal
    } else {
      s.data[key].push(newVal)
    }
  })

  return s
}

const cloneSquirm = (s) => {
  const newSquirm = new Squirm()
  newSquirm.data = JSON.parse(JSON.stringify(s.data))
  newSquirm.metadata = Object.assign({}, s.metadata)
  return newSquirm
}

const convertToString = (s) => {
  // construct header
  let str = '~~~\n'
  Object.entries(s.metadata).map(([key, value]) => {
    str += `${key}: ${value}\n`
  })
  str += '~~~\n'
  // construct body
  const keys = Object.keys(s.data)
  str += `cols ${keys.join(' ')}\n`
  const min = s.min
  const max = s.max
  str += `min ${keys.map(k => min[k]).join(' ')}\n`
  str += `max ${keys.map(k => max[k]).join(' ')}\n`
  str += Array.from({ length: s.data[keys[0]].length }, (_, rowIndex) => {
    return `~ ${keys.map(key => s.data[key][rowIndex]).join(' ')}`
  }).join('\n')

  return str
}

// TODO: chatGPT wrote this... make sure it works correctly
function validateSquirmString (squirmString) {
  // Split the string into lines
  const lines = squirmString.split('\n').map(line => line.trim())

  // Check for header enclosed in "~~~"
  if (lines[0] !== '~~~' || lines.indexOf('~~~', 1) === -1) {
    return false
  }

  // Validate header content
  const endOfHeaderIndex = lines.indexOf('~~~', 1)
  for (let i = 1; i < endOfHeaderIndex; i++) {
    if (!lines[i].includes(':')) {
      return false
    }
  }

  // Extract the data lines
  const dataLines = lines.slice(endOfHeaderIndex + 1)

  // Validate 'col', 'min', 'max', and data ticks
  if (dataLines.length < 4) {
    return false
  }

  // Validate 'col' line starts with 't'
  const colHeaders = dataLines[0].split(' ')
  if (colHeaders[0] !== 'col' || colHeaders[1] !== 't') {
    return false
  }

  // Validate 'min' and 'max' lines
  if (!dataLines[1].startsWith('min ') || !dataLines[2].startsWith('max ')) {
    return false
  }

  // Count the number of columns
  const numberOfCols = colHeaders.length - 1

  // Validate each tick
  for (let i = 3; i < dataLines.length; i++) {
    const tick = dataLines[i].split(' ')
    if (tick[1] !== 0) {
      return false
    }
    if (tick[0] !== '~' || tick.length !== numberOfCols + 1) {
      return false
    }
  }

  return true
}

const _saveToFile = (
  s,
  payload
) => {
  const path = payload && payload.path
    ? payload.path : `${s.metadata.emergence}.squirm`

  let dataString
  if (s instanceof Squirm) {
    dataString = convertToString(s)
  } else if (typeof s === 'string') {
    // TODO: validate s string
    dataString = s
  } else {
    console.error('the argument passed must be a string with squirm data or a squirm instance')
    return
  }

  if (typeof window === 'undefined') {
    // Node.js environment
    const fs = require('fs')
    fs.writeFile(path, dataString, (err) => {
      if (err) {
        console.error('Error writing file:', err)
      } else {
        console.log(`File saved to ${path}`)
      }
    })
  } else {
    // Browser environment
    const blob = new window.Blob([dataString], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = path
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  }
}

function loadFromFile (pathOrCallback, callback) {
  if (typeof window === 'undefined') {
    // Node.js environment
    const path = pathOrCallback
    const fs = require('fs')
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err)
        return callback(err)
      }
      callback(null, data)
    })
  } else {
    // Browser environment
    if (typeof pathOrCallback === 'function') {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = e => {
        const file = e.target.files[0]
        if (!file) {
          return
        }

        const reader = new window.FileReader()
        reader.onload = e => {
          const contents = e.target.result
          pathOrCallback(null, contents)
        }
        reader.onerror = e => {
          pathOrCallback(e.target.error)
        }
        reader.readAsText(file)
      }
      input.click()
    } else {
      console.error('In browser environment, the first argument should be a callback function')
    }
  }
}


// --> returns an object containing { x, t, y } values
// ?? say time is 0 to 50, we pass in 80 --- does it
// wrap: repeat, hallucinate, mirror, clamp // what does it do beyond time?
// interpolation:  // what does it do between time? nearest, linear, previous, next
// getAt can either be a number or an object
// accepts {
//  t: time,
//  wrap: repeat, 
//}

// assumes squirm.data.t is an array of values that is always increasing, and that t <= data.max.t
const getIndexOfPreviousFromTime = (s, time) => {
  let index = 0
  const tArray = s.data.t
  if (tArray.length > 0) {
    for (let i = 0; i < tArray.length; i++) {
      if (time < tArray[i]) break;
      index = i
    }
  }
  return index
}

const lerp = (a = 0, b = 0, progress = 0) => {
  console.log('lerping from ', a, b, progress)
  return (a + progress * (b - a))
}

const getAt = (s, param) => {
  let newSettings = {}
  if (typeof param === 'object') {
    newSettings = param // if a
  } else if (typeof param === 'number') {
    newSettings = { t: param }
  } else {
    console.error(`invalid type ${typeof param} passed to 'getAt()'. Should be a Number or an Object`)
  }

  let settings = Object.assign(
    { t: 0, wrap: 'repeat', from: 'before' },
    newSettings
  )

  const { t, from, wrap } = settings

  // repeat
  let time = t % s.max.t
  // @ todo: implement mirror and clamp
  let prevIndex = getIndexOfPreviousFromTime(s, time)
  let nextIndex = prevIndex < s.data.t.length - 1 ? prevIndex + 1 : prevIndex

  const tick = {}
  if (from === 'before') {
    Object.entries(s.data).forEach(([key, data]) => tick[key] = data[prevIndex])
  } else if (from === 'after') {
    Object.entries(s.data).forEach(([key, data]) => tick[key] = data[nextIndex])
  } else if (from === 'nearest') {
    const _t = s.data.t
    const index = time - _t[prevIndex] < _t[nextIndex] - time ? prevIndex : nextIndex
    Object.entries(s.data).forEach(([key, data]) => tick[key] = data[index])
  } else if (from === 'lerp') {
    const _t = s.data.t
    const progress = (time - _t[prevIndex]) / (_t[nextIndex] - _t[prevIndex])
    Object.entries(s.data).forEach(([key, data]) => tick[key] = lerp(data[prevIndex], data[nextIndex], progress))
  }
  // console.log('found timeAT!', t, time, s.data, tick, settings )
  // console.log(`index of ${t} is ${i}`, s.data.t)
  return tick

}



export default { _addTick, cloneSquirm, getAt, convertToString, _saveToFile, loadFromFile }
