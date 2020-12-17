import stampit from '@stamp/it'
import { Role } from '../domain/user.mjs'
import { Mapper } from './mapper.mjs'
import { createError, ErrorName } from '../common/error.mjs'

export const Repository = stampit({
  name: 'Repository',
  init({ sequelize }) {
    const { User, Role, ActivationStatus, Session } = sequelize.models
    this.User = User
    this.Role = Role
    this.ActivationStatus = ActivationStatus
    this.Session = Session
    this.mapper = Mapper()
  },
  methods: {
    async saveRolesIgnoreDuplicates(roles) {
      return await this.Role.bulkCreate(
        roles.map(name => ({ name })),
        { ignoreDuplicates: true }
      )
    },

    async getUsers() {
      const userDAOs = await this.User.findAll({
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAOs.map(userDAO => this.mapper.userFromDAO(userDAO))
    },

    async getUserByEmail(email) {
      const userDAO = await this.User.findOne({
        where: { email },
        include: ['roles', 'activationStatus', 'session']
      })
      return userDAO === null ? undefined : this.mapper.userFromDAO(userDAO)
    },

    async createUser(user) {
      try {
        const userDAOSpecs = this.mapper.userToDAOSpecs(user)
        let userDAO = await this.User.create({
          ...userDAOSpecs,
          roles: []
        }, { include: ['activationStatus', 'roles', 'session'] })
        await userDAO.setRoles(userDAOSpecs.roles.map(({ name }) => name))
        return this.mapper.userFromDAO(userDAO)
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (error.fields.hasOwnProperty('email')) {
            throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
          }
        }
        throw error
      }
    },

    async updateUser(id, updater) {
      const userDAO = await this.User.findByPk(
        id,
        { include: ['activationStatus', 'roles', 'session'] }
      )
      const user = this.mapper.userFromDAO(userDAO)
      const updatedUser = updater(user)

      // TODO: finish this

      const updatedUserDAOSpecs = this.mapper.userToDAOSpecs(updatedUser)
      await userDAO.save()
      await userDAO.setRoles(updatedUserDAOSpecs.roles.map(({ name }) => name))
      return this.mapper.userFromDAO(userDAO)
    }
  }
})
