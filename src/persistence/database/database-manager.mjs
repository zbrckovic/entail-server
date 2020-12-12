import stampit from '@stamp/it'
import { migrationSource } from './migrations.mjs'

export const DatabaseManager = stampit({
  name: 'DatabaseManager',
  init ({ knex }) {
    this.knex = knex
  },
  methods: {
    _getMigratorConfig () {
      return { migrationSource }
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
