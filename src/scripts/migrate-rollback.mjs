import { environment } from '../environment.mjs'
import { DatabaseManager } from '../persistence/database/database-manager.mjs'

const databaseManager = DatabaseManager({ environment })

databaseManager.rollbackMigrations().then(() => {
  console.log('Rolled back migrations.')
  process.exit()
})
