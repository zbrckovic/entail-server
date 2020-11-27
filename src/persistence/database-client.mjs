import knex from 'knex'
import { migrationSource } from './migrations.mjs'

export const DatabaseClient = ({ environment }) => {
  const knexInstance = knex({
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

  const knexMigrate = knexInstance.migrate
  const knexSchema = knexInstance.schema.withSchema(environment.pgSchema)

  const table = name => `${environment.pgSchema}.${name}`

  return {
    destroy: () => new Promise(resolve => { knexInstance.destroy(resolve) }),

    // schema
    migrateToLatest: () => knexMigrate.latest(migrationConfig),
    rollbackMigrations: () => knexMigrate.rollback(migrationConfig),
    hasTable: table => knexSchema.hasTable(table),

    // data
    getUsers: () => knex(table('user')).select('*')
  }
}
