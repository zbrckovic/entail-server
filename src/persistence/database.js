import pg from 'pg'
import { defer } from 'rxjs'
import { map } from 'rxjs/operators/index.js'

const { Client } = pg

export const initDatabase = environment => {
  const client = new Client({
    host: environment.pgHost,
    user: environment.pgUser,
    password: environment.pgPassword,
    database: environment.pgDatabase,
    port: environment.pgPort
  })

  return defer(() => client.connect())
    .pipe(map(() => createDatabase(client)))
}

const createDatabase = client => {
  const executeQuery = query => defer(() => client.query(query))

  const getUsers = () => (
    executeQuery('SELECT * FROM entail.public."user"')
      .pipe(map(result => result.rows))
  )

  return { getUsers }
}
