import { DatabaseClient } from '../persistence/database-client.mjs'
import { environment } from '../environment.mjs'
import { Repository } from '../persistence/repository.mjs'

let databaseClient
let repository
beforeAll(async () => {
  databaseClient = DatabaseClient({ environment })
  await databaseClient.migrateToLatest()
  repository = Repository({ databaseClient })
})

test('users repository', async () => {
  const user = {
    email: 'some@email.com',
    passwordHash: 'some password hash'
  }

  const createdUser = await repository.createUser(user)
  expect(createdUser).toEqual({ id: 1, ...user })

  const fetchedUsers = await repository.getUsers()
  expect(fetchedUsers).toEqual([createdUser])
})

afterAll(async () => {
  await databaseClient.rollbackMigrations()
  await databaseClient.destroy()
})
