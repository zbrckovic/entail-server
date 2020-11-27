import { environment } from '../environment.mjs'

const migrations = [
  [
    'createUserTable',
    {
      up: knex => (
        knex
          .schema
          .withSchema(environment.pgSchema)
          .createTable('user', table => {
            table.increments()
            table.string('email').notNullable()
            table.string('password').notNullable()
            table.timestamp('create_date').defaultTo(knex.fn.now())
            table.timestamp('update_date').defaultTo(knex.fn.now())
          })
      ),
      down: knex => (
        knex
          .schema
          .withSchema(environment.pgSchema)
          .dropTable('user')
      )
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
