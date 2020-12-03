import { environment } from '../environment.mjs'
import { DatabaseClient } from '../persistence/database-client.mjs'

const databaseClient = DatabaseClient({ environment })

databaseClient.migrateToLatest().then(() => {
  console.log('Migrated to latest.')
  process.exit()
})
