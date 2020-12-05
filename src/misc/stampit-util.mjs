import stampit from '@stamp/it'

const Cloneable = stampit().composers(({ stamp }) => {
  stamp.compose.methods = stamp.compose.methods || {}
  stamp.compose.methods.clone = function () { return Object.assign(stamp(), this) }
})
