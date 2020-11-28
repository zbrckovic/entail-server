import { DatabaseClient } from '../persistence/database-client'
import { environment } from '../environment'
import { UsersRepository } from './users-repository'
import { UsersService } from './users-service'
import { UsersRouter } from './users-router'

const databaseClient = DatabaseClient({ environment })
const usersRepository = UsersRepository({ databaseClient })
const usersService = UsersService({ usersRepository })
export const usersRouter = UsersRouter({ usersService })
