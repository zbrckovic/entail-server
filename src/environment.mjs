// Extracts data from all required environment variables and exports it as `environment` object.
// Rest of the application will access this data only through exported `environment`, never directly
// through `process.env`.

const parseBoolean = (value, defaultValue) => {
  return value === undefined ? defaultValue : JSON.parse(value)
}

const parseNumber = (value, defaultValue) => {
  return value === undefined ? defaultValue : JSON.parse(value)
}

const mode = process.env.NODE_ENV ?? 'development'
const port = parseNumber(process.env.PORT, 5000)
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
const uiUrl = process.env.UI_URL

const emailServerHost = process.env.EMAIL_SERVER_HOST
const emailServerPort = parseNumber(process.env.EMAIL_SERVER_PORT)
const emailServerUsername = process.env.EMAIL_SERVER_USERNAME
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD

const pgUser = process.env.PGUSER ?? 'postgres'
const pgHost = process.env.PGHOST ?? 'localhost'
const pgPassword = process.env.PGPASSWORD ?? 'postgres'
const pgDatabase = process.env.PGDATABASE ?? 'entail'
const pgPort = parseNumber(process.env.PGPORT, 5432)
const pgSchema = mode === 'test' ? 'test' : 'public'

const bcryptSaltRounds = parseNumber(process.env.BCRYPT_SALT_ROUNDS, 10)
const tokenSecret = process.env.TOKEN_SECRET
const apiTokenExpiresInMinutes = parseNumber(
  process.env.API_TOKEN_EXPIRES_IN_MINUTES, 15
)
const emailVerificationTokenExpiresInMinutes = parseNumber(
  process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MINUTES, 15
)
const passwordChangeTokenExpiresInMinutes = parseNumber(
  process.env.PASSWORD_CHANGE_TOKEN_EXPIRES_IN_MINUTES, 15
)

const logSql = parseBoolean(process.env.LOG_SQL, false)
const logI18n = parseBoolean(process.env.LOG_I18N, false)
const dbSchemaSyncAlter = parseBoolean(process.env.DB_SCHEMA_SYNC_ALTER, false)
const insertInitData = parseBoolean(process.env.INSERT_INIT_DATA, false)

export const environment = {
  mode,
  port,
  superAdminEmail,
  superAdminPassword,
  uiUrl,

  emailServerHost,
  emailServerPort,
  emailServerUsername,
  emailServerPassword,

  pgUser,
  pgHost,
  pgPassword,
  pgDatabase,
  pgPort,
  pgSchema,

  bcryptSaltRounds,
  tokenSecret,
  apiTokenExpiresInMinutes,
  emailVerificationTokenExpiresInMinutes,
  passwordChangeTokenExpiresInMinutes,

  logSql,
  logI18n,
  dbSchemaSyncAlter,
  insertInitData
}
