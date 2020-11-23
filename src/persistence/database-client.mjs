import knex from 'knex'

export const createDatabaseClient = environment => (
  knex({
    client: 'pg',
    connection: {
      host: environment.pgHost,
      user: environment.pgUser,
      password: environment.pgPassword,
      database: environment.pgDatabase,
      port: environment.pgPort
    }
  })
)
