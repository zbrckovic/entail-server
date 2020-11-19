import { createUserService } from './user-service.js'

export const createServices = database => {
  const userService = createUserService(database)
  return { userService }
}
