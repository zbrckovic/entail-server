import { createDBQueryBuilder, createDBSchemaBuilder, resolveDBSchema } from './database.mjs'
import { environment } from '../environment.mjs'

let dbQueryBuilder
let dbSchemaBuilder
beforeAll(done => {
  try {
    dbQueryBuilder = createDBQueryBuilder(environment)
    dbSchemaBuilder = createDBSchemaBuilder({ dbQueryBuilder, environment })
    dbQueryBuilder
      .migrate
      .latest({ schemaName: resolveDBSchema(environment) })
      .then(() => { done() }, done)
  } catch (error) {
    done(error)
  }
})

afterAll(done => {
  try {
    dbQueryBuilder
      .migrate
      .rollback({ schemaName: resolveDBSchema(environment) })
      .then(
        () => { dbQueryBuilder.destroy(done) },
        () => { dbQueryBuilder.destroy(done) }
      )
  } catch (error) {
    done(error)
  }
})

describe('database', () => {
  it('contains necessary tables', done => {
    try {
      dbSchemaBuilder
        .hasTable('users')
        .then(
          exists => {
            expect(exists).toBe(true)
            done()
          },
          done
        )
    } catch (error) {
      done(error)
    }
  })
})
