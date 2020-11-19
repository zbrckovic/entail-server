const mode = process.env.NODE_ENV ?? 'development'
const port = Number(process.env.PORT ?? 5000)
const pgUser = process.env.PGUSER ?? 'postgres'
const pgHost = process.env.PGHOST ?? 'localhost'
const pgPassword = process.env.PGPASSWORD ?? 'postgres'
const pgDatabase = process.env.PGDATABASE ?? 'entail'
const pgPort = Number(process.env.PGPORT ?? 5432)

export const environment = { mode, port, pgUser, pgHost, pgPassword, pgDatabase, pgPort }
