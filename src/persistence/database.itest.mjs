import { DatabaseClient } from './database-client.mjs'
import { environment } from '../environment.mjs'
import { concat } from 'rxjs'
import { tap } from 'rxjs/operators'

let dbClient
beforeAll(() => {
  dbClient = DatabaseClient({ environment })
  return dbClient.migrateToLatest().toPromise()
})

afterAll(() => (
  concat(
    dbClient.rollbackMigrations(),
    dbClient.destroy()
  ).toPromise()
))

describe('database', () => {
  it('contains necessary tables', () => (
    dbClient
      .hasTable('users')
      .pipe(tap(hasTable => { expect(hasTable).toBe(true) }))
      .toPromise()
  ))
})
