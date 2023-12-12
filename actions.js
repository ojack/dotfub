import Squirm from './Squirm.js'

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
      console.warn(`missing data for ${key}, using  ${newVal} instead`)
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

export default { _addTick, cloneSquirm, convertToString }
