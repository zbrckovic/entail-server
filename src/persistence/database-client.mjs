import knexFactory from 'knex'
import { migrationSource } from './migrations.mjs'
import _ from 'lodash'

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

  return {
    destroy: () => new Promise(resolve => { knex.destroy(resolve) }),

    migrateToLatest: () => knexMigrate.latest(migrationConfig),
    rollbackMigrations: () => knexMigrate.rollback(migrationConfig),
    hasTable: table => knexSchema.hasTable(table),

    getKnex: () => knex,
    getTableName: name => `${environment.pgSchema}.${name}`,

    // Transforms object to the format suitable for database. It changes all keys to snake case. If
    // `transformValue` is provided it'll be used to transform value.
    //
    // All `null` values will be transformed by `knex.raw('DEFAULT')` (regardless of
    // `transformValue`). Providing `null` is a means to set something to default in a database.
    toRecord: (object, transformValue) => {
      const result = {}

      _.forEach(object, (value, key) => {
        const transformedKey = _.snakeCase(key)

        let transformedValue
        if (value === null) {
          transformedValue = knex.raw('DEFAULT')
        } else if (transformValue !== undefined) {
          transformedValue = transformValue(value, key)
        }

        result[transformedKey] = transformedValue
      })

      return result
    },

    // Transforms record to the format suitable for application. It changes all keys to camel case.
    // If `transformValue` is provided it'll be used to transform value.
    fromRecord: (record, transformValue) => {
      const result = {}

      _.forEach(record, (value, key) => {
        const transformedKey = _.camelCase(key)

        let transformedValue
        if (transformValue !== undefined) {
          transformedValue = transformValue(value, key)
        }

        result[transformedKey] = transformedValue
      })

      return result
    }
  }
}
