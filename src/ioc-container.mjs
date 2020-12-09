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
import { knexFactory } from './persistence/database/knex.mjs'
import stampit from '@stamp/it'
import { AuthenticationService } from './web/authentication-service.mjs'
import { AuthorizationService } from './web/authorization-service.mjs'

// Resolves dependencies for each 'component' in the application.
export const IocContainer = stampit({
  init ({
    environment,
    knex,
    webInitializer,
    dataInitializer,
    databaseManager,
    repository,
    cryptographyService,
    emailService,
    entryService,
    usersService,
    entryRouter,
    usersRouter,
    i18nService,
    authenticationService,
    authorizationService
  }) {
    this.environment = environment
    this.knex = knex
    this.webInitializer = webInitializer
    this.dataInitializer = dataInitializer
    this.databaseManager = databaseManager
    this.repository = repository
    this.cryptographyService = cryptographyService
    this.emailService = emailService
    this.entryService = entryService
    this.usersService = usersService
    this.entryRouter = entryRouter
    this.usersRouter = usersRouter
    this.i18nService = i18nService
    this.authenticationService = authenticationService
    this.authorizationService = authorizationService
  },
  methods: {
    getEnvironment () {
      return this.environment
    },

    getKnex () {
      if (this.knex === undefined) {
        this.knex = knexFactory(this.getEnvironment())
      }
      return this.knex
    },

    getDatabaseManager () {
      if (this.databaseManager === undefined) {
        this.databaseManager = DatabaseManager({
          knex: this.getKnex(),
          environment: this.getEnvironment()
        })
      }
      return this.databaseManager
    },

    getDataInitializer () {
      if (this.dataInitializer === undefined) {
        this.dataInitializer = DataInitializer({
          knex: this.getKnex(),
          environment: this.getEnvironment(),
          cryptographyService: this.getCryptographyService(),
        })
      }
      return this.dataInitializer
    },

    getRepository () {
      if (this.repository === undefined) {
        this.repository = Repository({
          knex: this.getKnex(),
          environment: this.getEnvironment()
        })
      }
      return this.repository
    },

    getI18nService () {
      if (this.i18nService === undefined) {
        this.i18nService = I18nService({
          environment: this.getEnvironment()
        })
      }
      return this.i18nService
    },

    getCryptographyService () {
      if (this.cryptographyService === undefined) {
        this.cryptographyService = CryptographyService({
          environment: this.getEnvironment()
        })
      }
      return this.cryptographyService
    },

    getEmailService () {
      if (this.emailService === undefined) {
        this.emailService = EmailService({
          i18nService: this.getI18nService(),
          environment: this.getEnvironment()
        })
      }
      return this.emailService
    },

    getEntryService () {
      if (this.entryService === undefined) {
        this.entryService = EntryService({
          environment: this.getEnvironment(),
          repository: this.getRepository(),
          cryptographyService: this.getCryptographyService(),
          emailService: this.getEmailService()
        })
      }
      return this.entryService
    },

    getUsersService () {
      if (this.usersService === undefined) {
        this.usersService = UsersService({
          repository: this.getRepository()
        })
      }
      return this.usersService
    },

    getEntryRouter () {
      if (this.entryRouter === undefined) {
        this.entryRouter = EntryRouter({
          entryService: this.getEntryService(),
          authenticationService: this.getAuthenticationService()
        })
      }
      return this.entryRouter
    },

    getUsersRouter () {
      if (this.usersRouter === undefined) {
        this.usersRouter = UsersRouter({
          usersService: this.getUsersService(),
          authenticationService: this.getAuthenticationService(),
          authorizationService: this.getAuthorizationService()
        })
      }
      return this.usersRouter
    },

    getAuthenticationService () {
      if (this.authenticationService === undefined) {
        this.authenticationService = AuthenticationService({
          environment: this.getEnvironment()
        })
      }
      return this.authenticationService
    },

    getAuthorizationService () {
      if (this.authorizationService === undefined) {
        this.authorizationService = AuthorizationService()
      }
      return this.authorizationService
    },

    getWebInitializer () {
      if (this.webInitializer === undefined) {
        this.webInitializer = WebInitializer({
          entryRouter: this.getEntryRouter(),
          usersRouter: this.getUsersRouter()
        })
      }
      return this.webInitializer
    }
  }
})
