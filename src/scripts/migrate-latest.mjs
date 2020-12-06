import { environment } from '../environment.mjs'
import { DatabaseManager } from '../persistence/database/database-manager.mjs'

const databaseManager = DatabaseManager({ environment })

databaseManager.migrateToLatest().then(() => {
  console.log('Migrated to latest.')
  process.exit()
})
