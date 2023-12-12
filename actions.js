import Squirm from './Squirm.js'

const _addTick = (s, payload) => {
    // s.weird.push(data)
    Object.keys(s.data).forEach(key => {
        let newVal = payload[key]
        if (!key in payload) {
            // todo get last value here
            console.warn(`missing data for ${key}, using last value instead`)
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

export default { cloneSquirm, _addTick }