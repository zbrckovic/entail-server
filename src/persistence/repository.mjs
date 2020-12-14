import stampit from '@stamp/it'
import { Role } from '../domain/role.mjs'
import { Mapper } from './mapper.mjs'

export const Repository = stampit({
  name: 'Repository',
  init ({ sequelize }) {
    this.sequelize = sequelize
    this.mapper = Mapper()
  },
  methods: {
    // Saves all roles to database if they don't already exist.
    async storeAllRoles () {
      const roles = Object.values(Role)
      const roleDAOs = roles.map(role => this.mapper.roleToDAO(role))
      return await this.sequelize.models.Role.bulkCreate(
        roleDAOs,
        { ignoreDuplicates: true }
      )
    },

    async getUsers () {
      const userDAOs = await this.sequelize.models.User.findAll()
      return userDAOs.map(userDAO => this.mapper.userFromDAO(userDAO))
    },

    async getUserByEmail (email) {
      const user = await this.sequelize.models.User.findOne({ where: { email } })
      return user ?? undefined
    },

    async createUser (user) {
      const userDAO = this.mapper.userToDAO(user)
      const createdUserDAO = await this.sequelize.models.User.create(userDAO)
      return this.mapper.userFromDAO(createdUserDAO)
    }
  }
})
