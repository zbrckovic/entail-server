const mode = process.env.NODE_ENV ?? 'development'
const port = process.env.PORT ?? 5000
const pgUser = process.env.PGUSER ?? 'postgres'
const pgHost = process.env.PGHOST ?? 'localhost'
const pgPassword = process.env.PGPASSWORD ?? 'postgres'
const pgDatabase = process.env.PGDATABASE ?? 'entail'
const pgPort = process.env.PGPORT ?? '5432'
const pgSchema = mode === 'test' ? 'test' : 'public'

const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS !== undefined
  ? Number(process.env.BCRYPT_SALT_ROUNDS)
  : 10

const activationCodeValidityPeriodMinutes =
  process.env.ACTIVATION_CODE_VALIDITY_PERIOD_MINUTES !== undefined
    ? Number(process.env.ACTIVATION_CODE_VALIDITY_PERIOD_MINUTES)
    : 60

export const environment = {
  mode,
  port,
  pgUser,
  pgHost,
  pgPassword,
  pgDatabase,
  pgPort,
  pgSchema,
  bcryptSaltRounds,
  activationCodeValidityPeriodMinutes
}
