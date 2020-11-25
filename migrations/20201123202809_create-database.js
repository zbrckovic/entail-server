const schema = process.env.NODE_ENV === 'test' ? 'test' : 'public'

exports.up = knex => (
  knex
    .schema
    .withSchema(schema)
    .createTable('users', table => {
      table.increments()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.timestamp('create_date').defaultTo(knex.fn.now())
      table.timestamp('update_date').defaultTo(knex.fn.now())
    })
)

exports.down = knex => (
  knex
    .schema
    .withSchema(schema)
    .dropTable('users')
)
