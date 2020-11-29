import knexFactory from 'knex'
import { migrationSource } from './migrations.mjs'
import _ from 'lodash'
import moment from 'moment'

// A value used to set the value in database to default.
export const DEFAULT = Symbol('DEFAULT')

// Creates knex instance to be used by repositories and provides API for basic administrative
// operations with database.
export const DatabaseClient = ({ environment }) => {
  const knex = knexFactory({
    client: 'pg',
    connection: {
      host: environment.pgHost,
      user: environment.pgUser,
      password: environment.pgPassword,
      database: environment.pgDatabase,
      port: environment.pgPort
    }
  })

  const migrationConfig = { migrationSource, schemaName: environment.pgSchema }

  const knexMigrate = knex.migrate
  const knexSchema = knex.schema.withSchema(environment.pgSchema)

  const toRecordKey = key => _.snakeCase(key)

  const fromRecordKey = key => _.camelCase(key)

  const toRecordValue = value => {
    if (value === DEFAULT) return knex.raw('DEFAULT')
    if (moment.isMoment(value)) return value.toDate()
    return value
  }

  const fromRecordValue = value => {
    if (value === null) return undefined
    if (value instanceof Date) return moment(value)
    return value
  }

  return {
    destroy: () => new Promise(resolve => { knex.destroy(resolve) }),

    migrateToLatest: async () => knexMigrate.latest(migrationConfig),
    rollbackMigrations: async () => knexMigrate.rollback(migrationConfig),
    hasTable: async table => knexSchema.hasTable(table),

    getKnex: () => knex,
    getTableName: name => `${environment.pgSchema}.${name}`,

    // Transforms object to the format suitable for database. It changes all keys to snake case.
    toRecord: object => {
      const result = {}

      _.forEach(object, (value, key) => {
        result[toRecordKey(key)] = toRecordValue(value)
      })

      return result
    },

    // Transforms record to the format suitable for application. It changes all keys to camel case.
    fromRecord: record => {
      const result = {}

      _.forEach(record, (value, key) => {
        result[fromRecordKey(key)] = fromRecordValue(value)
      })

      return result
    }
  }
}
