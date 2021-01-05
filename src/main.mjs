import express from 'express'
import { environment } from './environment.mjs'
import figlet from 'figlet'
import { IocContainer } from './common/ioc-container.mjs'
import { createFnWithTransaction, createSequelize } from './persistence/sequelize.mjs'
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
import { UsersService } from './application/users-service.mjs'
import { UsersRouter } from './presentation/web/routers/users-router.mjs'
import cors from 'cors'
import { ProjectsRepository } from './persistence/repositories/projects-repository.mjs'
import { ProjectsService } from './application/projects-service.mjs'
import { ProjectsRouter } from './presentation/web/routers/projects-router.mjs'

(async () => {
  console.log(figlet.textSync('Entail', { font: 'slant' }))

  const iocContainer = IocContainer()
    .setValue('environment', environment)
    // persistence
    .setFactory('sequelize', createSequelize)
    .setFactory('withTransaction', createFnWithTransaction)
    .setFactory('rolesRepository', RolesRepository)
    .setFactory('usersRepository', UsersRepository)
    .setFactory('projectsRepository', ProjectsRepository)
    .setFactory('dataInitializationService', DataInitializationService)
    // infrastructure
    .setFactory('i18nService', I18nService)
    .setFactory('cryptographyService', CryptographyService)
    .setFactory('emailService', EmailService)
    .setFactory('authenticationService', AuthenticationService)
    .setFactory('authorizationService', AuthorizationService)
    // application
    .setFactory('entryService', EntryService)
    .setFactory('accountService', AccountService)
    .setFactory('usersService', UsersService)
    .setFactory('projectsService', ProjectsService)
    // presentation
    .setFactory('authorizationMiddlewareFactory', AuthorizationMiddlewareFactory)
    .setFactory('authenticationMiddlewareFactory', AuthenticationMiddlewareFactory)
    .setFactory('validationMiddlewareFactory', ValidationMiddlewareFactory)
    .setFactory('entryRouter', EntryRouter)
    .setFactory('accountRouter', AccountRouter)
    .setFactory('usersRouter', UsersRouter)
    .setFactory('projectsRouter', ProjectsRouter)
    .setFactory('webInitializer', WebInitializer)

  await iocContainer.i18nService.initT()
  await iocContainer.sequelize.authenticate()
  await iocContainer.sequelize.sync({ force: true })
  if (environment.insertInitData) await iocContainer.dataInitializationService.initData()

  const app = express()

  app.use(cors({
    origin: environment.uiUrl,
    credentials: true,
    optionsSuccessStatus: 200
  }))

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
