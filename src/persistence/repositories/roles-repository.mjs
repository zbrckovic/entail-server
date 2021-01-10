import { roleMapper } from '../mappers/user-mapper.mjs'

export const RolesRepository = ({ sequelize }) => {
  const { Role } = sequelize.models

  return {
    async createRoles (roles) {
      await Role.bulkCreate(
        roles.map(role => roleMapper.toPersistence(role)),
        { ignoreDuplicates: true }
      )
    }
  }
}
