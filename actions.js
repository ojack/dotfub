import Squirm from './Squirm.js'

// @todo: should always have time, should add new time such that time array is always increasing
const _addTick = (s, payload) => {
  if (typeof s.metadata.emergence === 'undefined') {
    s.metadata.emergence = new Date().toISOString()
  }

  Object.keys(s.data).forEach(key => {
    let newVal = payload[key]
    if (!(key in payload)) {
      // todo: think this through a bit more
      newVal = s.data[key].length === 0
        ? 0 : s.data[key][s.data[key].length - 1]
      console.warn(`missing data for ${key}, using  ${nexwVal} instead`)
    }
    s.data[key].push(newVal)
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

export default { _addTick, cloneSquirm, convertToString, getAt }
