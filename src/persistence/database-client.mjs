import { migrationSource } from './migrations.mjs'

// Creates knex instance to be used by repositories and provides API for basic administrative
// operations with database.
export const DatabaseClient = ({ knex, databaseUtil, environment: { pgSchema } }) => {
  const migrationConfig = { migrationSource, schemaName: pgSchema }

  const knexMigrate = knex.migrate
  const knexSchema = knex.schema.withSchema(pgSchema)

  return {
    ...databaseUtil,

    destroy: () => new Promise(resolve => { knex.destroy(resolve) }),

    migrateToLatest: async () => knexMigrate.latest(migrationConfig),
    rollbackMigrations: async () => knexMigrate.rollback(migrationConfig),

    hasTable: async table => knexSchema.hasTable(table),
  }
}
