import knex from 'knex'

export const knexFactory = environment => knex({
  client: 'pg',
  debug: false,
  connection: {
    host: environment.pgHost,
    user: environment.pgUser,
    password: environment.pgPassword,
    database: environment.pgDatabase,
    port: environment.pgPort
  }
})
