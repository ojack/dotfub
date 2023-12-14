import Fubble from './Fubble.js'
import actions from './actions.js'

const { cloneFubble } = actions

// object containing public facing library of squirm functions
const fubbleActions = {}

// For each squirm action, add that action as a method to the Fubble class, and also as a a standalone function
// For example, `addTick` can be called as `myFubble.addTick(point)` or as `addTick(myFubble, point)`

Object.entries(actions).forEach(([name, action]) => {
  // Generate standalone action function from each action
  // if function name starts with '_', it should be cloned before operation is calculated.
  // i.e. the public-facing function `addTick()` will call the private function `_addTick()`
  let newName = name
  if (newName.indexOf('_') === 0) {
    newName = newName.substring(1)
    fubbleActions[newName] = (s, payload) => {
      if (!(s instanceof Fubble)) {
        console.error('First argument must be an instance of Fubble')
        return
      }
      const clone = cloneFubble(s)
      action(clone, payload)
      return clone
    }
  } else {
    fubbleActions[newName] = action
  }

  // add method to Fubble prototype
  Fubble.prototype[newName] = function (payload = null) {
    return action(this, payload)
  }
})

export { Fubble, fubbleActions }
