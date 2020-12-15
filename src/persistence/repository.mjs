import stampit from '@stamp/it'
import { Role } from '../domain/user.mjs'
import { Mapper } from './mapper.mjs'
import { createError, ErrorName } from '../common/error.mjs'

export const Repository = stampit({
  name: 'Repository',
  init({ sequelize }) {
    const { User, Role, ActivationStatus } = sequelize.models
    this.User = User
    this.Role = Role
    this.ActivationStatus = ActivationStatus
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
      const userDAOs = await this.User.findAll({ include: ['roles', 'activationStatus'] })
      return userDAOs.map(userDAO => this.mapper.userFromDAO(userDAO))
    },

    async getUserByEmail(email) {
      const userDAO = await this.User.findOne({
        where: { email },
        include: ['roles', 'activationStatus']
      })
      return userDAO === null ? undefined : this.mapper.userFromDAO(userDAO)
    },

    async createUser(user) {
      try {
        const userDAOSpecs = this.mapper.userToDAOSpecs(user)
        let userDAO = await this.User.create({
          ...userDAOSpecs,
          roles: []
        }, { include: ['activationStatus', 'roles'] })
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

    async updateUser() {

    }
  }
})
