import { createUsersService } from './users-service.mjs'

export const createServices = repository => {
  const usersService = createUsersService(repository)

  return { usersService }
}
