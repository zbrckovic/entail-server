import { environment } from '../environment.mjs'
import { DatabaseManager } from '../persistence/database/database-manager.mjs'
import { createKnex } from '../persistence/database/knex.mjs'

const knex = createKnex({ environment })
const databaseManager = DatabaseManager({ knex, environment })

databaseManager.rollbackMigrations().then(() => {
  console.log('Rolled back migrations.')
  process.exit()
})
