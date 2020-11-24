const mode = process.env.NODE_ENV
const port = process.env.PORT
const pgUser = process.env.PGUSER
const pgHost = process.env.PGHOST
const pgPassword = process.env.PGPASSWORD
const pgDatabase = process.env.PGDATABASE
const pgPort = process.env.PGPORT

export const environment = { mode, port, pgUser, pgHost, pgPassword, pgDatabase, pgPort }
