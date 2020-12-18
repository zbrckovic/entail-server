import { createError, ErrorName } from '../common/error.mjs'
import { Mapper } from './mapper.mjs'

export const Repository = ({ sequelize }) => {
  const { User, Role } = sequelize.models
  const mapper = Mapper()

  return Object.freeze({
    async saveRolesIgnoreDuplicates (roles) {
      return await Role.bulkCreate(
        roles.map(name => ({ name })),
        { ignoreDuplicates: true }
      )
    },

    async getUsers () {
      const userDAOs = await User.findAll({
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAOs.map(userDAO => mapper.userFromDAO(userDAO))
    },

    async getUserByEmail (email) {
      const userDAO = await User.findOne({
        where: { email },
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAO === null ? undefined : mapper.userFromDAO(userDAO)
    },

    async createUser (user) {
      try {
        const userDAOSpecs = mapper.userToDAOSpecs(user)
        let userDAO = await User.create({
          ...userDAOSpecs,
          roles: []
        }, { include: ['activationStatus', 'roles', 'session'] })
        await userDAO.setRoles(userDAOSpecs.roles.map(({ name }) => name))
        return mapper.userFromDAO(userDAO)
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (error.fields.hasOwnProperty('email')) {
            throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
          }
        }
        throw error
      }
    },

    async updateUser (id, updater) {
      const userDAO = await User.findByPk(
        id,
        { include: ['activationStatus', 'roles', 'session'] }
      )
      const user = mapper.userFromDAO(userDAO)
      const updatedUser = updater(user)

      // TODO: finish this

      const updatedUserDAOSpecs = mapper.userToDAOSpecs(updatedUser)
      await userDAO.save()
      await userDAO.setRoles(updatedUserDAOSpecs.roles.map(({ name }) => name))
      return mapper.userFromDAO(userDAO)
    }
  })
}

