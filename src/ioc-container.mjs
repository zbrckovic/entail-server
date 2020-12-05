import { DatabaseClient } from './persistence/database/database-client.mjs'
import { UsersRepository } from './persistence/repositories/users-repository.mjs'
import { UsersService } from './core/users/users-service.mjs'
import { UsersRouter } from './web/routers/users-router.mjs'
import { CryptographyService } from './utils/cryptography-service.mjs'
import { EmailService } from './external/email-service.mjs'
import { AuthenticationService } from './core/users/authentication-service.mjs'
import { AuthenticationRouter } from './web/routers/authentication-router.mjs'
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
  authenticationService,
  usersService,
  authenticationRouter,
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

  const getAuthenticationService = () => {
    if (authenticationService === undefined) {
      authenticationService = AuthenticationService({
        environment,
        usersRepository: getUsersRepository(),
        cryptographyService: getCryptographyService(),
        emailService
      })
    }
    return authenticationService
  }

  const getUsersService = () => {
    if (usersService === undefined) {
      usersService = UsersService({
        usersRepository: getUsersRepository()
      })
    }
    return usersService
  }

  const getAuthenticationRouter = () => {
    if (authenticationRouter === undefined) {
      authenticationRouter = AuthenticationRouter({
        authenticationService: getAuthenticationService()
      })
    }
    return authenticationRouter
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
        authenticationRouter: getAuthenticationRouter(),
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

    getAuthenticationService,
    getUsersService,

    getWebInitializer,
    getAuthenticationRouter,
    getUsersRouter
  })
}
