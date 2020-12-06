import stampit from '@stamp/it'

export const SelfAware = stampit({
  name: 'SelfAware',
  composers: [
    ({ stamp }) => {
      stamp.compose.methods = stamp.compose.methods || {}
      stamp.compose.methods.getStamp = () => stamp
    }
  ]
})

const initArgs = Symbol('InitProps')
export const Cloneable = stampit({
  name: 'Cloneable',
  init (args) {
    this[initArgs] = args
  },
  composers: [
    ({ stamp }) => {
      stamp.compose.methods = stamp.compose.methods || {}
      stamp.compose.methods.clone = function () {
        return Object.assign(stamp(this[initArgs]), this)
      }
    }
  ]
})
