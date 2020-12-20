// Extracts data from all required environment variables and exports it as `environment` object.
// Rest of the application will read only `environment`, never `process.env`.

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue
  return JSON.parse(value)
}

const parseNumber = (value, defaultValue) => {
  if (value === undefined) return defaultValue
  return JSON.parse(value)
}

const mode = process.env.NODE_ENV ?? 'development'
const port = parseNumber(process.env.PORT, 5000)
const pgUser = process.env.PGUSER ?? 'postgres'
const pgHost = process.env.PGHOST ?? 'localhost'
const pgPassword = process.env.PGPASSWORD ?? 'postgres'
const pgDatabase = process.env.PGDATABASE ?? 'entail'
const pgPort = parseNumber(process.env.PGPORT, 5432)
const pgSchema = mode === 'test' ? 'test' : 'public'

const bcryptSaltRounds = parseNumber(process.env.BCRYPT_SALT_ROUNDS, 10)

const activationCodeValidPeriodMinutes =
  parseNumber(process.env.ACTIVATION_CODE_VALID_PERIOD_MINUTES, 60)

const emailServerHost = process.env.EMAIL_SERVER_HOST
const emailServerPort = parseNumber(process.env.EMAIL_SERVER_PORT)
const emailServerUsername = process.env.EMAIL_SERVER_USERNAME
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD

const apiTokenSecret = process.env.API_TOKEN_SECRET
const apiTokenExpiresInMinutes = parseNumber(process.env.API_TOKEN_EXPIRES_IN_MINUTES)
const refreshTokenExpiresInMinutes = parseNumber(process.env.REFRESH_TOKEN_EXPIRES_IN_MINUTES)

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
  apiTokenSecret,
  apiTokenExpiresInMinutes,
  refreshTokenExpiresInMinutes,
  logSql,
  dbSchemaSyncAlter,
  insertInitData,
  logI18n
}
