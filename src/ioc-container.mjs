import { DatabaseClient } from './persistence/database-client'
import { UsersRepository } from './users/users-repository'
import { UsersService } from './users/users-service'
import { UsersRouter } from './users/users-router'
import { CryptographyService } from './users/cryptography-service'

export const IocContainer = environment => {
  const getDatabaseClient = (() => {
    let result

    return () => {
      if (result === undefined) result = DatabaseClient({ environment })
      return result
    }
  })()

  const getUsersRepository = (() => {
    let result

    return () => {
      const databaseClient = getDatabaseClient()
      if (result === undefined) result = UsersRepository({ databaseClient })
      return result
    }
  })()

  const getCryptographyService = (() => {
    let result

    return () => {
      if (result === undefined) result = CryptographyService({ environment })
      return result
    }
  })()

  const getUsersService = (() => {
    let result

    return () => {
      const usersRepository = getUsersRepository()
      const cryptographyService = getCryptographyService()
      if (result === undefined) result = UsersService({ usersRepository, cryptographyService })
      return result
    }
  })()

  const getUsersRouter = (() => {
    let result

    return () => {
      const usersService = getUsersService()
      if (result === undefined) result = UsersRouter({ usersService })
      return result
    }
  })()

  return ({
    getDatabaseClient,
    getUsersRepository,
    getUsersService,
    getUsersRouter
  })
}
