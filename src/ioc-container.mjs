import { DatabaseClient } from './persistence/database-client'
import { UsersRepository } from './users/users-repository'
import { UsersService } from './users/users-service'
import { UsersRouter } from './users/users-router'
import { CryptographyService } from './users/cryptography-service'

export const IocContainer = environment => {
  const getDatabaseClient = (() => {
    let result

    return () => {
      if (result === undefined) {
        result = DatabaseClient({ environment })
      }

      return result
    }
  })()

  const getUsersRepository = (() => {
    let result

    return () => {
      if (result === undefined) {
        const databaseClient = getDatabaseClient()
        result = UsersRepository({ databaseClient })
      }

      return result
    }
  })()

  const getCryptographyService = (() => {
    let result

    return () => {
      if (result === undefined) {
        result = CryptographyService({ environment })
      }

      return result
    }
  })()

  const getUsersService = (() => {
    let result

    return () => {
      if (result === undefined) {
        const usersRepository = getUsersRepository()
        const cryptographyService = getCryptographyService()

        result = UsersService({
          environment,
          usersRepository,
          cryptographyService
        })
      }

      return result
    }
  })()

  const getUsersRouter = (() => {
    let result

    return () => {
      if (result === undefined) {
        const usersService = getUsersService()

        result = UsersRouter({ usersService })
      }
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
