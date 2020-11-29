import { environment } from '../environment.mjs'
import moment from 'moment'
import _ from 'lodash'
import { createMomentEqualityCustomizer } from '../utils/equality-customizers.mjs'
import { ErrorName } from '../error.mjs'
import { IocContainer } from '../ioc-container'

const eqCustomizer = createMomentEqualityCustomizer('minute')

let iocContainer
beforeEach(async () => {
  iocContainer = IocContainer(environment)
  await iocContainer.getDatabaseClient().migrateToLatest()
})

test('Can get, create, update and delete.', async () => {
  const usersRepository = iocContainer.getUsersRepository()

  const user = {
    email: 'raffaello@email.com',
    passwordHash: 'tmnt',
    createdOn: moment(),
    lastUpdatedOn: moment()
  }

  const createdUser = await usersRepository.createUser(user)

  user.id = createdUser.id
  expect(_.isEqualWith(createdUser, user, eqCustomizer)).toBe(true)

  expect(_.isEqualWith(
    await usersRepository.getUsers(),
    [user],
    eqCustomizer
  )).toBe(true)

  expect(_.isEqualWith(
    await usersRepository.getUserById(user.id),
    user,
    eqCustomizer
  )).toBe(true)

  expect(_.isEqualWith(
    await usersRepository.getUserByEmail(user.email),
    user,
    eqCustomizer
  )).toBe(true)

  user.passwordHash = 'tmnt2'
  expect(_.isEqualWith(
    await usersRepository.updateUser({ id: user.id, passwordHash: user.passwordHash }),
    user,
    eqCustomizer
  )).toBe(true)

  expect(_.isEqualWith(
    await usersRepository.deleteUser(user.id),
    user,
    eqCustomizer
  )).toBe(true)

  expect(await usersRepository.getUsers()).toEqual([])
})

test('Getting non-existent user by id gives undefined.', async () => {
  const usersRepository = iocContainer.getUsersRepository()

  const user = await usersRepository.getUserById(1)
  expect(user).toBeUndefined()
})

test(`Creating user with existent email throws ${ErrorName.EMAIL_ALREADY_USED}.`, async () => {
  const usersRepository = iocContainer.getUsersRepository()

  const user1 = {
    email: 'raffaello@email.com',
    passwordHash: 'tmnt',
    createdOn: moment(),
    lastUpdatedOn: moment()
  }

  await usersRepository.createUser(user1)

  const user2 = {
    email: 'raffaello@email.com',
    passwordHash: 'tmnt',
    createdOn: moment(),
    lastUpdatedOn: moment()
  }

  return expect(async () => {
    await usersRepository.createUser(user2)
  }).rejects.toThrow(ErrorName.EMAIL_ALREADY_USED)
})

afterEach(async () => {
  const databaseClient = iocContainer.getDatabaseClient()
  await databaseClient.rollbackMigrations()
  await databaseClient.destroy()
})
