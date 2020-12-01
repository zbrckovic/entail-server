import { environment } from '../environment.mjs'
import { DatabaseClient } from '../persistence/database-client.mjs'

const databaseClient = DatabaseClient({ environment })
databaseClient.rollbackMigrations().then(() => {
  console.log('Rolled back migrations.')
  process.exit()
})
