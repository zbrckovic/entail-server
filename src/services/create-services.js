import { createUsersService } from './users-service.js'

export const createServices = database => {
  const usersService = createUsersService(database)

  return { usersService }
}
