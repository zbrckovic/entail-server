import { environment } from '../environment.mjs'

const migrations = [
  [
    'createUserTable',
    {
      up: knex => knex
        .schema
        .withSchema(environment.pgSchema)
        .createTable('user', table => {
          table.increments()
          table.string('email', 256).unique().notNullable()
          table.string('password_hash', 60).notNullable()
          table.timestamp('created_on').notNullable().defaultTo(knex.fn.now())
          table.timestamp('last_updated_on').notNullable().defaultTo(knex.fn.now())
          table.boolean('is_activated').notNullable().defaultTo(false)
          table.string('activation_code', 256)
          table.timestamp('activation_code_expires_on')
        }),
      down: knex => knex
        .schema
        .withSchema(environment.pgSchema)
        .dropTable('user')

    }
  ]
]

const migrationsByNames = Object.fromEntries(migrations)
const migrationNames = migrations.map(([name]) => name)

export const migrationSource = {
  getMigrations: async () => migrationNames,
  getMigrationName: migrationName => migrationName,
  getMigration: migrationName => migrationsByNames[migrationName]
}
