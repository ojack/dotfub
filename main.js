import Squirm from './Squirm.js'
import { } from './actions.js'


const actionsToExport = {}
Object.entries(squirmActionsThatNeedCloning).forEach(([name, action]) => {
    actionsToExport[name] = (s, payload) => {
        const clone = cloneSquirm(s)
        action(clone)(payload)
        return clone
    }
})

Object.entries(squirmActions).forEach(([name, action]) => {
    // add as method to squirm class
    Squirm.prototype[name] = function (data) {
        return action(this)(data)
    }
})

Object.entries(squirmActionsThatNeedCloning).forEach(([name, action]) => {
    // add as method to squirm class
    Squirm.prototype[name] = function (data) {
        return action(this)(data)
    }
    // generate user-facing method
})