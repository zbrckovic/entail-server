import knexFactory from 'knex'

export const createKnex = ({ environment }) => knexFactory({
  client: 'pg',
  connection: {
    host: environment.pgHost,
    user: environment.pgUser,
    password: environment.pgPassword,
    database: environment.pgDatabase,
    port: environment.pgPort
  }
})
