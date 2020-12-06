import stampit from '@stamp/it'
import knexFactory from 'knex'
import _ from 'lodash'
import { DB_DEFAULT_VALUE } from './misc.mjs'
import moment from 'moment'
import { migrationSource } from './migrations.mjs'

export const DatabaseClient = stampit({
  init ({ environment }) {
    this.schemaName = environment.pgSchema

    this.knex = knexFactory({
      client: 'pg',
      connection: {
        host: environment.pgHost,
        user: environment.pgUser,
        password: environment.pgPassword,
        database: environment.pgDatabase,
        port: environment.pgPort
      }
    })

    this.migrationConfig = { migrationSource, schemaName: this.schemaName }
  },
  methods: {
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

    getTableName (name) { return `${this.schemaName}.${name}` },

    async destroy () {
      return new Promise(resolve => { this.knex.destroy(resolve) })
    },
    async migrateToLatest () {
      return await this.knex.migrate.latest(this.migrationConfig)
    },
    async rollbackMigrations () {
      return await this.knex.migrate.rollback(this.migrationConfig)
    },
    async hasTable (table) {
      return await this.knex.schema.withSchema(this.schemaName).hasTable(table)
    }
  }
})
