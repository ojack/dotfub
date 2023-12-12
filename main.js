import Squirm from './Squirm.js'
import actions from './actions.js'

const { cloneSquirm } = actions

// object containing public facing library of squirm functions
const squirmActions = {}
Object.entries(actions).forEach(([name, action]) => {
    // Generate standalone action function from each action
    // if function name starts with '_', should be cloned and modified before passing to function. 
    // i.e. the public-facing function `addTick()` will call the private function `_addTick()`
    let newName = name
    if(newName.indexOf('_') === 0) {
        newName = newName.substring(1)
        squirmActions[newName] = (s, payload) => {
            const clone = cloneSquirm(s)
            action(clone, payload)
            return clone
        }
    } else {
        squirmActions[newName] = action
    }

    // add method to Squirm prototype
    Squirm.prototype[newName] = function (payload) {
        return action(this, payload)
    }
})

export { Squirm, squirmActions }
