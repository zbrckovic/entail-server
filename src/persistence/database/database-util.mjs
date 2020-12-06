import stampit from '@stamp/it'
import _ from 'lodash'
import moment from 'moment'
import { DB_DEFAULT_VALUE } from './misc.mjs'

export const DatabaseUtil = stampit({
  init ({ knex, environment }) {
    this.knex = knex
    this.environment = environment
  },
  methods: {
    getTableName (name) { return `${this.environment.pgSchema}.${name}` },
    // Transforms object to the format suitable for database. It changes all keys to snake case.
    toRecord (object) {
      const result = {}

      _.forEach(object, (value, key) => {
        result[this._toRecordKey(key)] = this._toRecordValue(value)
      })

      return result
    },
    _toRecordKey (key) { return _.snakeCase(key) },
    _toRecordValue (value) {
      if (value === DB_DEFAULT_VALUE) return this.knex.raw('DEFAULT')
      if (moment.isMoment(value)) return value.toDate()
      return value
    },

    // Transforms record to the format suitable for application. It changes all keys to camel case.
    fromRecord (record) {
      const result = {}

      _.forEach(record, (value, key) => {
        result[this._fromRecordKey(key)] = this._fromRecordValue(value)
      })

      return result
    },
    _fromRecordKey (key) {return _.camelCase(key) },
    _fromRecordValue (value) {
      if (value === null) return undefined
      if (value instanceof Date) return moment(value)
      return value
    },
  }
})
