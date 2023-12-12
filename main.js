import Squirm from './Squirm.js'
import actions from './actions.js'

const { cloneSquirm } = actions

// object containing public facing library of squirm functions
const squirmActions = {}

// For each squirm action, add that action as a method to the Squirm class, and also as a a standalone function
// For example, `addTick` can be called as `mySquirm.addTick(point)` or as `addTick(mySquirm, point)`

Object.entries(actions).forEach(([name, action]) => {
  // Generate standalone action function from each action
  // if function name starts with '_', it should be cloned before operation is calculated.
  // i.e. the public-facing function `addTick()` will call the private function `_addTick()`
  let newName = name
  if (newName.indexOf('_') === 0) {
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
  Squirm.prototype[newName] = function (payload = null) {
    return action(this, payload)
  }
})

export { Squirm, squirmActions }
