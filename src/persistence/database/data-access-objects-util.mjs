// Executes `chain` of transformer links on `value` and returns final result.
import moment from 'moment'
import stampit from '@stamp/it'

export const Transformer = stampit({
  statics: {
    with (target) {
      return this({ target })
    }
  },
  init ({ target }) {
    this._target = target
  },
  methods: {
    transform (key, ...chain) {
      this._target[key] = this._transform(this._target[key], ...chain)
      return this
    },

    _transform (value, ...chain) {
      const [firstLink, ...restLinks] = chain
      return firstLink === undefined
        ? value
        : firstLink(value, newValue => this._transform(newValue, ...restLinks))
    },

    get () { return this._target }
  }
})

// Transformer chain links (operators).
export const ifDefined = (value, next) => value === undefined ? value : next(value)
export const dateToMoment = (value, next) => next(moment(value))
export const momentToDate = (value, next) => next(value.toDate())
export const nullToUndefined = (value, next) => next(value === null ? undefined : value)
