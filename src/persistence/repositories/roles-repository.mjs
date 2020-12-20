import { roleMapper } from '../mappers/role-mapper.mjs'

export const RolesRepository = ({ sequelize }) => {
  const {
    RoleModel
  } = sequelize.models

  return {
    async saveRoles (roles) {
      await RoleModel.bulkCreate(
        roles.map(role => roleMapper.toPersistence(role)),
        { ignoreDuplicates: true }
      )
    }
  }
}
