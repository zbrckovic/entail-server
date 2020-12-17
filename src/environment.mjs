// Extracts data from all required environment variables and exports it as `environment` object.
// Rest of the application will read only `environment`, never `process.env`.

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue
  return JSON.parse(value)
}

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

const activationCodeValidPeriodMinutes =
  process.env.ACTIVATION_CODE_VALID_PERIOD_MINUTES !== undefined
    ? Number(process.env.ACTIVATION_CODE_VALID_PERIOD_MINUTES)
    : 60

const emailServerHost = process.env.EMAIL_SERVER_HOST
const emailServerPort = process.env.EMAIL_SERVER_PORT
const emailServerUsername = process.env.EMAIL_SERVER_USERNAME
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD

const jwtSecret = process.env.JWT_SECRET
const jwtExpiresInMinutes = process.env.JWT_EXPIRES_IN_MINUTES

const logSql = parseBoolean(process.env.LOG_SQL, false)
const dbSchemaSyncAlter = parseBoolean(process.env.DB_SCHEMA_SYNC_ALTER, false)
const insertInitData = parseBoolean(process.env.INSERT_INIT_DATA, false)
const logI18n = parseBoolean(process.env.LOG_I18N, false)

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
  activationCodeValidPeriodMinutes,
  emailServerHost,
  emailServerPort,
  emailServerUsername,
  emailServerPassword,
  superAdminEmail,
  superAdminPassword,
  jwtSecret,
  jwtExpiresInMinutes,
  logSql,
  dbSchemaSyncAlter,
  insertInitData,
  logI18n
}

