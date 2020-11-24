const dotenv = require('dotenv')
dotenv.config()

const pgUser = process.env.PGUSER
const pgHost = process.env.PGHOST
const pgPassword = process.env.PGPASSWORD
const pgDatabase = process.env.PGDATABASE
const pgPort = Number(process.env.PGPORT)

module.exports = {
  client: 'pg',
  connection: {
    host: pgHost,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
    port: pgPort
  },
  migrations: {}
}
