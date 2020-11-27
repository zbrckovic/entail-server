import { DatabaseClient } from '../persistence/database-client.mjs'
import { environment } from '../environment.mjs'

let databaseClient
beforeAll(async () => {
  databaseClient = DatabaseClient({ environment })
  await databaseClient.migrateToLatest()
})

afterAll(async () => {
  await databaseClient.rollbackMigrations()
  await databaseClient.destroy()
})

describe('database', () => {
  it('contains necessary tables', async () => {
    const hasTable = await databaseClient.hasTable('user')
    expect(hasTable).toBe(true)
  })
})
