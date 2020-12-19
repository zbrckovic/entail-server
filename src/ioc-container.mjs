import { DataInitializationService } from './application/data-initialization-service.mjs'
import { EntryService } from './application/entry-service.mjs'
import { UsersService } from './application/users-service.mjs'
import { environment } from './environment.mjs'
import { CryptographyService } from './infrastructure/cryptography-service.mjs'
import { EmailService } from './infrastructure/email-service.mjs'
import { I18nService } from './infrastructure/i18n/i18n-service.mjs'
import { createModels } from './persistence/sequelize.mjs'
import { UsersRepository } from './persistence/repositories/users-repository.mjs'
import { AuthenticationService } from './presentation/web/aspects/authentication-service.mjs'
import { AuthorizationService } from './presentation/web/aspects/authorization-service.mjs'
import { ValidationService } from './presentation/web/aspects/validation-service.mjs'
import { EntryRouter } from './presentation/web/routers/entry-router.mjs'
import { UsersRouter } from './presentation/web/routers/users-router.mjs'
import { WebInitializer } from './presentation/web/web-initializer.mjs'
import { RolesRepository } from './persistence/repositories/roles-repository.mjs'

const IocContainer = () => {
  const values = {}

  return {
    // Registers `create` factory which will be called when dependency with `name` is first time
    // requested. `create` gets the container as first parameter.
    setFactory (name, create) {
      Object.defineProperty(this, name, {
        get: () => {
          if (!Object.prototype.hasOwnProperty.call(values, name)) {
            values[name] = create(this)
          }
          return values[name]
        },
        configurable: true,
        enumerable: true
      })

      return this
    },
    setValue (name, value) {
      return this.setFactory(name, () => value)
    }
  }
}

export const createDefaultIocContainer = () => (
  IocContainer()
    .setValue('environment', environment)
    .setFactory('sequelize', ({ environment }) => createModels({ environment }))
    .setFactory('rolesRepository', ({ sequelize }) => RolesRepository({ sequelize }))
    .setFactory('usersRepository', ({ sequelize }) => UsersRepository({ sequelize }))
    .setFactory('dataInitializationService', ({
      rolesRepository,
      usersRepository,
      environment,
      cryptographyService
    }) => DataInitializationService({
      rolesRepository,
      usersRepository,
      environment,
      cryptographyService
    }))
    .setFactory('i18nService', ({ environment }) => I18nService({ environment }))
    .setFactory('cryptographyService', ({ environment }) => CryptographyService({ environment }))
    .setFactory('emailService', ({
      i18nService,
      environment
    }) => EmailService({
      i18nService,
      environment
    }))
    .setFactory('entryService', ({
      environment,
      usersRepository,
      cryptographyService,
      emailService
    }) => EntryService({
      environment,
      usersRepository,
      cryptographyService,
      emailService
    }))
    .setFactory('usersService', ({ usersRepository }) => UsersService({ usersRepository }))
    .setFactory('entryRouter', ({
      entryService,
      authenticationService,
      validationService
    }) => EntryRouter({
      entryService,
      authenticationService,
      validationService
    }))
    .setFactory('usersRouter', ({
      usersService,
      authenticationService,
      authorizationService
    }) => UsersRouter({
      usersService,
      authenticationService,
      authorizationService
    }))
    .setFactory('validationService', () => ValidationService())
    .setFactory('authenticationService', ({
      environment,
      cryptographyService
    }) => AuthenticationService({
      environment,
      cryptographyService
    }))
    .setFactory('authorizationService', () => AuthorizationService())
    .setFactory('webInitializer', ({
      entryRouter,
      usersRouter
    }) => WebInitializer({
      entryRouter,
      usersRouter
    }))
)
