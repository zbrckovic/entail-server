import { Role } from '../users/role.mjs'

// Stores data which has to be present for application to work properly.
export const DataInitializer = ({
  knex,
  databaseUtil: {
    getTableName,
    toRecord,
    fromRecord
  },
  cryptographyService: {
    createPasswordHash
  },
  environment: {
    superAdminEmail,
    superAdminPassword
  }
}) => ({
  init: async () => {
    const tableRole = getTableName('role')
    const tableUser = getTableName('user')
    const tableUserRole = getTableName('user_role')

    const roles = Object.keys(Role).map(name => ({ name }))
    await knex(tableRole).insert(roles.map(toRecord)).onConflict('name').ignore()

    if (superAdminEmail !== undefined && superAdminPassword !== undefined) {
      const [superAdminRecord] = await knex(tableUser)
        .insert(
          toRecord({
            email: superAdminEmail,
            passwordHash: await createPasswordHash(superAdminPassword),
            isActivated: true
          }),
          ['id']
        )
        .onConflict('email')
        .ignore()

      if (superAdminRecord !== undefined) {
        const superAdminId = fromRecord(superAdminRecord).id

        const [superAdminRoleRecord] = await knex(tableRole)
          .where({ name: Role.SUPER_ADMIN })
          .select(['id'])
        const superAdminRoleId = fromRecord(superAdminRoleRecord).id

        await knex(tableUserRole)
          .insert(toRecord({ userId: superAdminId, roleId: superAdminRoleId }))
          .onConflict(['user_id', 'role_id'])
          .ignore()
      }
    }
  }
})
