import { environment } from '../environment.mjs'
import { DatabaseManager } from '../persistence/database/database-manager.mjs'
import { knexFactory } from '../persistence/database/knex.mjs'

const knex = knexFactory(environment)
const databaseManager = DatabaseManager({ knex, environment })

databaseManager.migrateToLatest().then(() => {
  console.log('Migrated to latest.')
  process.exit()
})
