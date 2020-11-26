import { DatabaseClient } from './database-client.mjs'
import { environment } from '../environment.mjs'
import { concat } from 'rxjs'

let dbClient
beforeAll(done => {
  dbClient = DatabaseClient({ environment })
  dbClient
    .migrateToLatest()
    .subscribe({
      complete: () => { done() },
      error: error => { done(error) }
    })
})

afterAll(done => {
  concat(
    dbClient.rollbackMigrations(),
    dbClient.destroy()
  ).subscribe({
    complete: () => { done() },
    error: error => { done(error) }
  })
})

describe('database', () => {
  it('contains necessary tables', done => {
    dbClient
      .hasTable('users')
      .subscribe({
        next: hasTable => { expect(hasTable).toBe(true) },
        complete: () => { done() },
        error: error => { done(error) }
      })
  })
})
