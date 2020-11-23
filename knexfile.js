const pgUser = process.env.PGUSER ?? 'postgres'
const pgHost = process.env.PGHOST ?? 'localhost'
const pgPassword = process.env.PGPASSWORD ?? 'postgres'
const pgDatabase = process.env.PGDATABASE ?? 'entail'
const pgPort = Number(process.env.PGPORT ?? 5432)

const client = 'pg'

const connection = {
  host: pgHost,
  user: pgUser,
  password: pgPassword,
  database: pgDatabase,
  port: pgPort
}

const migrations = {
}

module.exports = {
  development: {
    client,
    connection,
    migrations
  },
  production: {
    client,
    connection,
    migrations
  }
}
