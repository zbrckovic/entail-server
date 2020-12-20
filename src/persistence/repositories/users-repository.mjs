import { createError, ErrorName } from '../../common/error.mjs'
import { userMapper } from '../mappers/user-mapper.mjs'
import { roleMapper } from '../mappers/role-mapper.mjs'

export const UsersRepository = ({ sequelize }) => {
  const { UserModel } = sequelize.models

  return {
    // Returns user or undefined.
    async getUserByEmail (email) {
      const userDAO = await UserModel.findOne({
        where: { email },
        include: ['roles']
      })
      return userDAO === null ? undefined : userMapper.fromPersistence(userDAO)
    },

    // Returns user or undefined.
    async getUserById (id) {
      const userDAO = await UserModel.findByPk(id, {
        include: ['roles']
      })
      return userDAO === null ? undefined : userMapper.fromPersistence(userDAO)
    },

    // Creates user or throws `EMAIL_ALREADY_USED`.
    async createUser (user) {
      try {
        const userDAO = await UserModel.create(userMapper.toPersistence(user))
        await userDAO.setRoles(user.roles.map(role => roleMapper.toPersistence(role)))
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (Object.prototype.hasOwnProperty.call(error.fields, 'email')) {
            throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
          }
        }
        throw error
      }
    },

    async updateUser (user) {
      const userDAO = UserModel.findByPk(user.id, { include: ['session'] })
      await userDAO.update(userMapper.toPersistence(user))
      userDAO.setRoles(user.roles.map(role => roleMapper.toPersistence(role)))
    }
  }
}
