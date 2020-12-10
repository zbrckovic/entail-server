import { DatabaseManager } from './persistence/database/database-manager.mjs'
import { Repository } from './persistence/repository.mjs'
import { UsersService } from './core/users/users-service.mjs'
import { UsersRouter } from './web/routers/users-router.mjs'
import { CryptographyService } from './utils/cryptography-service.mjs'
import { EmailService } from './external/email-service.mjs'
import { EntryService } from './core/users/entry-service.mjs'
import { EntryRouter } from './web/routers/entry-router.mjs'
import { I18nService } from './i18n/i18n-service.mjs'
import { DataInitializer } from './persistence/database/data-initializer.mjs'
import { WebInitializer } from './web/web-initializer.mjs'
import { createKnex } from './persistence/database/knex.mjs'
import stampit from '@stamp/it'
import { AuthenticationService } from './web/authentication-service.mjs'
import { AuthorizationService } from './web/authorization-service.mjs'
import { environment } from './environment.mjs'

// Inversion of control container
//
// Resolves dependencies for each 'component' in the application.
export const IocContainer = stampit({
  props: {
    values: {}
  },
  methods: {
    // Factory gets the container as first parameter.
    setFactory (name, create) {
      Object.defineProperty(this, name, {
        get: () => {
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
    setValue (name, value) { return this.setFactory(name, () => value) }
  }
})

export const createDefaultIocContainer = () => IocContainer()
  .setValue('environment', environment)
  .setFactory('knex', ({ environment }) => createKnex({ environment }))
  .setFactory('databaseManager', ({ knex, environment }) => DatabaseManager({
    knex,
    environment
  }))
  .setFactory('dataInitializer', ({
    knex,
    environment,
    cryptographyService
  }) => DataInitializer({
    knex,
    environment,
    cryptographyService,
  }))
  .setFactory('repository', ({ knex, environment }) => Repository({ knex, environment }))
  .setFactory('i18nService', ({ environment }) => I18nService({ environment }))
  .setFactory('cryptographyService', ({ environment }) => CryptographyService({ environment }))
  .setFactory('emailService', ({ i18nService, environment }) => EmailService({
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
  .setFactory('entryRouter', ({ entryService, authenticationService }) => EntryRouter({
    entryService,
    authenticationService
  }))
  .setFactory('usersRouter', ({
    usersService, authenticationService, authorizationService
  }) => UsersRouter({
    usersService,
    authenticationService,
    authorizationService,
  }))
  .setFactory('authenticationService', ({ environment }) => AuthenticationService({ environment }))
  .setFactory('authorizationService', () => AuthorizationService())
  .setFactory('webInitializer', ({ entryRouter, usersRouter }) => WebInitializer({
    entryRouter,
    usersRouter,
  }))
