import knex from 'knex'
import { migrationSource } from './migrations.mjs'
import { defer, Observable } from 'rxjs'

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
    destroy: () => new Observable(subscriber => {
      knexInstance.destroy(() => { subscriber.complete() })
    }),

    // schema
    migrateToLatest: () => defer(() => knexMigrate.latest(migrationConfig)),
    rollbackMigrations: () => defer(() => knexMigrate.rollback(migrationConfig)),
    hasTable: table => defer(() => knexSchema.hasTable(table)),

    // data
    getUsers: () => defer(() => knex(table('user')).select('*'))
  }
}
