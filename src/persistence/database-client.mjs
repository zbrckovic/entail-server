import knexFactory from 'knex'
import { migrationSource } from './migrations.mjs'

// Creates knex instance and provides API for basic administrative operations with database.
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
    getTableName: name => `${environment.pgSchema}.${name}`
  }
}
