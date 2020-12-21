import express from 'express'
import { environment } from './environment.mjs'
import figlet from 'figlet'
import { IocContainer } from './common/ioc-container.mjs'
import { createSequelize } from './persistence/sequelize.mjs'
import { RolesRepository } from './persistence/repositories/roles-repository.mjs'
import { UsersRepository } from './persistence/repositories/users-repository.mjs'
import { DataInitializationService } from './persistence/data-initialization-service.mjs'
import { I18nService } from './infrastructure/i18n/i18n-service.mjs'
import { CryptographyService } from './infrastructure/cryptography-service.mjs'
import { EmailService } from './infrastructure/email-service.mjs'
import { AuthenticationService } from './infrastructure/authentication-service.mjs'
import { AuthorizationService } from './infrastructure/authorization-service.mjs'
import { EntryService } from './application/entry-service.mjs'
import { AuthenticationMiddlewareFactory } from './presentation/web/middleware/authentication-middleware-factory.mjs'
import { AuthorizationMiddlewareFactory } from './presentation/web/middleware/authorization-middleware-factory.mjs'
import { ValidationMiddlewareFactory } from './presentation/web/middleware/validation-middleware-factory.mjs'
import { EntryRouter } from './presentation/web/routers/entry-router.mjs'
import { AccountRouter } from './presentation/web/routers/account-router.mjs'
import { WebInitializer } from './presentation/web/web-initializer.mjs'
import { AccountService } from './application/account-service.mjs'

(async () => {
  console.log(figlet.textSync('Entail', { font: 'slant' }))

  const iocContainer = IocContainer()
    .setValue('environment', environment)

    // persistence
    .setFactory('sequelize', ({ environment }) => createSequelize({ environment }))
    .setFactory('rolesRepository', ({ sequelize }) => RolesRepository({ sequelize }))
    .setFactory('usersRepository', ({ sequelize }) => UsersRepository({ sequelize }))
    .setFactory(
      'dataInitializationService',
      ({
        rolesRepository, usersRepository, environment, cryptographyService
      }) => DataInitializationService({
        rolesRepository, usersRepository, environment, cryptographyService
      })
    )

    // infrastructure
    .setFactory('i18nService', ({ environment }) => I18nService({ environment }))
    .setFactory('cryptographyService', ({ environment }) => CryptographyService({ environment }))
    .setFactory(
      'emailService',
      ({ i18nService, environment }) => EmailService({ i18nService, environment })
    )
    .setFactory(
      'authenticationService',
      ({
        environment, cryptographyService, usersRepository
      }) => AuthenticationService({
        environment, cryptographyService, usersRepository
      })
    )
    .setFactory('authorizationService', () => AuthorizationService())

    // application
    .setFactory(
      'entryService',
      ({
        usersRepository,
        cryptographyService,
        emailService,
        authenticationService
      }) => EntryService({
        usersRepository,
        cryptographyService,
        emailService,
        authenticationService
      })
    )
    .setFactory(
      'accountService',
      ({
        authenticationService, usersRepository, emailService, cryptographyService
      }) => AccountService({
        authenticationService, usersRepository, emailService, cryptographyService
      }))

    // presentation
    .setFactory(
      'authorizationMiddlewareFactory',
      ({ authorizationService }) => AuthorizationMiddlewareFactory({ authorizationService })
    )
    .setFactory(
      'authenticationMiddlewareFactory',
      ({ authenticationService }) => AuthenticationMiddlewareFactory({ authenticationService })
    )
    .setFactory(
      'validationMiddlewareFactory',
      () => ValidationMiddlewareFactory()
    )
    .setFactory(
      'entryRouter',
      ({ environment, entryService, validationMiddlewareFactory }) => EntryRouter({
        environment, entryService, validationMiddlewareFactory
      })
    )
    .setFactory(
      'accountRouter',
      ({
        environment,
        accountService,
        authenticationMiddlewareFactory,
        validationMiddlewareFactory
      }) => AccountRouter({
        environment,
        accountService,
        authenticationMiddlewareFactory,
        validationMiddlewareFactory
      })
    )
    .setFactory(
      'webInitializer',
      ({ entryRouter, accountRouter }) => WebInitializer({
        entryRouter, accountRouter
      })
    )
  await iocContainer.i18nService.initT()
  await iocContainer.sequelize.authenticate()
  await iocContainer.sequelize.sync({ force: true })
  if (environment.insertInitData) await iocContainer.dataInitializationService.initData()

  const app = express()
  iocContainer.webInitializer.init(app)

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)
      resolve()
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
