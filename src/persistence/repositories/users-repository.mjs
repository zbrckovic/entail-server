import { createError, ErrorName } from '../../common/error.mjs'
import { userMapper } from '../mappers/user-mapper.mjs'
import { roleMapper } from '../mappers/role-mapper.mjs'
import { activationStatusMapper } from '../mappers/activation-status-mapper.mjs'
import { sessionMapper } from '../mappers/session-mapper.mjs'

export const UsersRepository = ({ sequelize }) => {
  const {
    UserModel,
    ActivationStatusModel
  } = sequelize.models

  return Object.freeze({
    async getAllUsers () {
      const userDAOs = await UserModel.findAll({
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAOs.map(userDAO => userMapper.fromPersistence(userDAO))
    },

    async getUserByEmail (email) {
      const userDAO = await UserModel.findOne({
        where: { email },
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAO === null ? undefined : userMapper.fromPersistence(userDAO)
    },

    async createUser (user) {
      try {
        const userDAO = await UserModel.create(userMapper.toPersistence(user))

        await userDAO.createActivationStatus(
          activationStatusMapper.toPersistence(user.activationStatus, user.id)
        )

        if (user.session !== undefined) {
          await userDAO.createSession(sessionMapper.toPersistence(user.session, user.id))
        }

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

      await ActivationStatusModel.update(
        activationStatusMapper.toPersistence(user.activationStatus, user.id),
        { where: { userId: user.id } }
      )

      if (user.session !== undefined) {
        if (userDAO.session !== null) {
          await userDAO.setSession(userMapper.toPersistence(user.session, user.id))
        } else {
          await userDAO.createSession(userMapper.toPersistence(user.session, user.id))
        }
      } else {
        await userDAO.setSession(null)
      }

      userDAO.setRoles(user.roles.map(role => roleMapper.toPersistence(role)))
    }
  })
}
