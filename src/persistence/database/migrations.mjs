import { environment } from '../../environment.mjs'

const migrations = [
  [
    'createTables',
    {
      up: knex => knex
        .schema
        .withSchema(environment.pgSchema)
        .createTable('user', user => {
          user.increments()
          user.string('email', 256).unique().notNullable()
          user.string('password_hash', 60).notNullable()
          user.timestamp('created_on').notNullable().defaultTo(knex.fn.now())
          user.timestamp('last_updated_on').notNullable().defaultTo(knex.fn.now())
          user.boolean('is_activated').notNullable().defaultTo(false)
          user.string('activation_code', 256).nullable()
          user.timestamp('activation_code_expires_on').nullable()
        })
        .createTable('role', role => {
          role.increments()
          role.string('name', 128).unique().notNullable()
        })
        .createTable('user_role', userRole => {
          userRole.increments()
          userRole
            .integer('user_id')
            .references('id')
            .inTable('user')
            .notNullable()
            .onDelete('cascade')
          userRole
            .integer('role_id')
            .references('id')
            .inTable('role')
            .notNullable()
            .onDelete('cascade')
          userRole.unique(['user_id', 'role_id'])
        }),
      down: knex => knex
        .schema
        .withSchema(environment.pgSchema)
        .dropTable('user_role')
        .dropTable('role')
        .dropTable('user')
    },
  ]
]

const migrationsByNames = Object.fromEntries(migrations)
const migrationNames = migrations.map(([name]) => name)

export const migrationSource = {
  getMigrations: async () => migrationNames,
  getMigrationName: migrationName => migrationName,
  getMigration: migrationName => migrationsByNames[migrationName]
}
