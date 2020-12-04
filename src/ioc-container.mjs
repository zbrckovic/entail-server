import { DatabaseClient } from './persistence/database/database-client.mjs'
import { UsersRepository } from './persistence/repositories/users-repository.mjs'
import { UsersService } from './core/users/users-service.mjs'
import { UsersRouter } from './web/routers/users-router.mjs'
import { CryptographyService } from './utils/cryptography-service.mjs'
import { EmailService } from './external/email-service.mjs'
import { AuthService } from './core/users/auth-service.mjs'
import { AuthRouter } from './web/routers/auth-router.mjs'
import { I18nService } from './i18n/i18n-service.mjs'
import { DatabaseUtil } from './persistence/database/database-util.mjs'
import { createKnex } from './persistence/database/knex.mjs'
import { DataInitializer } from './persistence/database/data-initializer.mjs'
import { WebInitializer } from './web/web-initializer.mjs'

// Resolves dependencies for each 'component' in the application.
export const IocContainer = ({
  environment,
  webInitializer,
  knex,
  databaseUtil,
  dataInitializer,
  databaseClient,
  usersRepository,
  cryptographyService,
  emailService,
  authService,
  usersService,
  authRouter,
  usersRouter,
  i18nService
}) => {
  const getKnex = () => {
    if (knex === undefined) {
      knex = createKnex({ environment })
    }
    return knex
  }

  const getDatabaseUtil = () => {
    if (databaseUtil === undefined) {
      databaseUtil = DatabaseUtil({
        knex: getKnex(),
        environment
      })
    }
    return databaseUtil
  }

  const getDataInitializer = () => {
    if (dataInitializer === undefined) {
      dataInitializer = DataInitializer({
        knex: getKnex(),
        databaseUtil: getDatabaseUtil(),
        cryptographyService: getCryptographyService(),
        environment
      })
    }
    return dataInitializer
  }

  const getDatabaseClient = () => {
    if (databaseClient === undefined) {
      databaseClient = DatabaseClient({
        knex: getKnex(),
        databaseUtil: getDatabaseUtil(),
        cryptographyService: getCryptographyService(),
        environment
      })
    }
    return databaseClient
  }

  const getUsersRepository = () => {
    if (usersRepository === undefined) {
      usersRepository = UsersRepository({
        knex: getKnex(),
        databaseClient: getDatabaseClient()
      })
    }
    return usersRepository
  }

  const getI18nService = () => {
    if (i18nService === undefined) {
      i18nService = I18nService({ environment })
    }
    return i18nService
  }

  const getCryptographyService = () => {
    if (cryptographyService === undefined) {
      cryptographyService = CryptographyService({ environment })
    }
    return cryptographyService
  }

  const getEmailService = () => {
    if (emailService === undefined) {
      emailService = EmailService({
        i18nService: getI18nService(),
        environment
      })
    }
    return emailService
  }

  const getAuthService = () => {
    if (authService === undefined) {
      authService = AuthService({
        environment,
        usersRepository: getUsersRepository(),
        cryptographyService: getCryptographyService(),
        emailService
      })
    }
    return authService
  }

  const getUsersService = () => {
    if (usersService === undefined) {
      usersService = UsersService({
        usersRepository: getUsersRepository()
      })
    }
    return usersService
  }

  const getAuthRouter = () => {
    if (authRouter === undefined) {
      authRouter = AuthRouter({
        authService: getAuthService()
      })
    }
    return authRouter
  }

  const getUsersRouter = () => {
    if (usersRouter === undefined) {
      usersRouter = UsersRouter({
        usersService: getUsersService()
      })
    }
    return usersRouter
  }

  const getWebInitializer = () => {
    if (webInitializer === undefined) {
      webInitializer = WebInitializer({
        authRouter: getAuthRouter(),
        usersRouter: getUsersRouter()
      })
    }
    return webInitializer
  }

  return ({
    getDataInitializer,
    getDatabaseClient,

    getUsersRepository,

    getI18nService,
    getEmailService,
    getCryptographyService,

    getAuthService,
    getUsersService,

    getWebInitializer,
    getAuthRouter,
    getUsersRouter
  })
}
