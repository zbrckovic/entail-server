import { DatabaseClient } from './persistence/database-client.mjs'
import { UsersRepository } from './users/users-repository.mjs'
import { UsersService } from './users/users-service.mjs'
import { UsersRouter } from './users/users-router.mjs'
import { CryptographyService } from './auth/cryptography-service.mjs'
import { EmailService } from './auth/email-service.mjs'
import { AuthService } from './auth/auth-service.mjs'
import { AuthRouter } from './auth/auth-router.mjs'
import { I18nService } from './i18n/i18n-service.mjs'

export const IocContainer = ({
  environment,
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
  const getDatabaseClient = () => {
    if (databaseClient === undefined) {
      cryptographyService = getCryptographyService()
      databaseClient = DatabaseClient({ environment, cryptographyService })
    }
    return databaseClient
  }

  const getUsersRepository = () => {
    if (usersRepository === undefined) {
      const databaseClient = getDatabaseClient()
      usersRepository = UsersRepository({ databaseClient })
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
      const i18nService = getI18nService()
      emailService = EmailService({ environment, i18nService })
    }
    return emailService
  }

  const getAuthService = () => {
    if (authService === undefined) {
      const emailService = getEmailService()
      const usersRepository = getUsersRepository()
      const cryptographyService = getCryptographyService()

      authService = AuthService({
        environment,
        usersRepository,
        cryptographyService,
        emailService
      })
    }
    return authService
  }

  const getUsersService = () => {
    if (usersService === undefined) {
      const usersRepository = getUsersRepository()
      usersService = UsersService({ usersRepository })
    }
    return usersService
  }

  const getAuthRouter = () => {
    if (authRouter === undefined) {
      authService = getAuthService()
      authRouter = AuthRouter({ authService })
    }
    return authRouter
  }

  const getUsersRouter = () => {
    if (usersRouter === undefined) {
      usersService = getUsersService()
      usersRouter = UsersRouter({ usersService })
    }
    return usersRouter
  }

  return ({
    getDatabaseClient,

    getUsersRepository,

    getI18nService,
    getEmailService,
    getCryptographyService,

    getAuthService,
    getUsersService,

    getAuthRouter,
    getUsersRouter
  })
}
