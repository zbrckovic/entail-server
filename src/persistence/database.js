import knex from 'knex'
import { defer } from 'rxjs'

export const createDatabase = environment => {
  const client = knex({
    client: 'pg',
    connection: {
      host: environment.pgHost,
      user: environment.pgUser,
      password: environment.pgPassword,
      database: environment.pgDatabase,
      port: environment.pgPort
    }
  })

  const getUsers = () => defer(() => client('user').select('*'))

  return { getUsers }
}
