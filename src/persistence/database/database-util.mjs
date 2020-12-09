import stampit from '@stamp/it'
import _ from 'lodash'
import moment from 'moment'
import { DB_DEFAULT_VALUE } from './misc.mjs'

export const DatabaseUtil = stampit({
  name: 'DatabaseUtil',
  init ({ knex, environment }) {
    this.knex = knex
    this.environment = environment

    this.schema = environment.pgSchema

    this.tableRole = this.getTableName('role')
    this.tableUser = this.getTableName('user')
    this.tableUserRole = this.getTableName('user_role')
  },
  methods: {
    getTableName (name) { return `${this.schema}.${name}` },

    // Transforms object to the format suitable for database. It changes all keys to snake case.
    toRecord (value) {
      if (value === DB_DEFAULT_VALUE) return this.knex.raw('DEFAULT')
      if (Array.isArray(value)) return value.map(element => this.toRecord(element))
      if (moment.isMoment(value)) return value.toDate()

      if (typeof value === 'object') {
        const result = {}

        _.forEach(value, (valueForKey, key) => {
          result[_.snakeCase(key)] = this.toRecord(valueForKey)
        })

        return result
      }

      return value
    },
    _toRecordKey (key) { return _.snakeCase(key) },
    _toRecordValue (value) {
      if (value === DB_DEFAULT_VALUE) return this.knex.raw('DEFAULT')
      if (moment.isMoment(value)) return value.toDate()
      return value
    },

    // Transforms record to the format suitable for application. It changes all keys to camel case.
    fromRecord (value) {
      if (Array.isArray(value)) return value.map(element => this.fromRecord(element))
      if (value === null) return undefined
      if (value instanceof Date) return moment(value)

      if (typeof value === 'object') {
        const result = {}

        _.forEach(value, (valueForKey, key) => {
          result[_.camelCase(key)] = this.fromRecord(valueForKey)
        })

        return result
      }

      return value
    }
  }
})
