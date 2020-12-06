import stampit from '@stamp/it'
import { migrationSource } from './migrations.mjs'

export const DatabaseManager = stampit({
  init ({ knex, environment }) {
    this.knex = knex
    this.environment = environment
  },
  methods: {
    _getMigratorConfig () {
      return { migrationSource, schemaName: this.environment.pgSchema }
    },
    async migrateToLatest () {
      return await this.knex.migrate.latest(this._getMigratorConfig())
    },
    async rollbackMigrations () {
      return await this.knex.migrate.rollback(this._getMigratorConfig())
    },
    async destroy () {
      return new Promise(resolve => { this.knex.destroy(resolve) })
    },
  }
})
