import stampit from '@stamp/it'
import { EntryService } from './application/entry-service.mjs'
import { UsersService } from './application/users-service.mjs'
import { environment } from './environment.mjs'
import { CryptographyService } from './infrastructure/cryptography-service.mjs'
import { EmailService } from './infrastructure/email-service.mjs'
import { createSequelize } from './persistence/database/sequelize.mjs'
import { Repository } from './persistence/repository.mjs'
import { I18nService } from './infrastructure/i18n/i18n-service.mjs'
import { AuthenticationService } from './presentation/web/aspects/authentication-service.mjs'
import { AuthorizationService } from './presentation/web/aspects/authorization-service.mjs'
import { ValidationService } from './presentation/web/aspects/validation-service.mjs'
import { EntryRouter } from './presentation/web/routers/entry-router.mjs'
import { UsersRouter } from './presentation/web/routers/users-router.mjs'
import { WebInitializer } from './presentation/web/web-initializer.mjs'

export const IocContainer = stampit({
  props: {
    values: {}
  },
  methods: {
    // Registers `create` factory which will be called when dependency with `name` is first time
    // requested. `create` gets the container as first parameter.
    setFactory(name, create) {
      Object.defineProperty(this, name, {
        get: () => {
          // eslint-disable-next-line no-prototype-builtins
          if (!this.values.hasOwnProperty(name)) {
            this.values[name] = create(this)
          }
          return this.values[name]
        },
        configurable: true,
        enumerable: true
      })

      return this
    },
    setValue(name, value) { return this.setFactory(name, () => value) }
  }
})

export const createDefaultIocContainer = () => IocContainer()
  .setValue('environment', environment)
  .setFactory('sequelize', ({ environment }) => createSequelize({ environment }))
  .setFactory('repository', ({ sequelize }) => Repository({ sequelize }))
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
    repository,
    cryptographyService,
    emailService
  }) => EntryService({
    environment,
    repository,
    cryptographyService,
    emailService
  }))
  .setFactory('usersService', ({ repository }) => UsersService({ repository }))
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
  .setFactory('authenticationService', ({ environment }) => AuthenticationService({ environment }))
  .setFactory('authorizationService', () => AuthorizationService())
  .setFactory('webInitializer', ({
    entryRouter,
    usersRouter
  }) => WebInitializer({
    entryRouter,
    usersRouter
  }))
