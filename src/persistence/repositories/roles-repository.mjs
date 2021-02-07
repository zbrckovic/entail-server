import { roleMapper } from '../mappers/user-mapper.mjs'
import stampit from '@stamp/it'

export const RolesRepository = stampit({
  init ({ sequelize }) {
    this.models = sequelize.models
  },
  methods: {
    async createRoles (roles) {
      const { Role } = this.models

      await Role.bulkCreate(
        roles.map(role => roleMapper.toPersistence(role)),
        { ignoreDuplicates: true }
      )
    }
  }
})
