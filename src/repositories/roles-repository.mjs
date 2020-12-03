export const RolesRepository = ({ knex, databaseClient }) => {
  const table = databaseClient.getTableName('role')

  return {
    getRoles: async () => {
      const roleRecords = await knex(table).select('*')
      return roleRecords.map(databaseClient.fromRecord)
    },

    getRoleById: async id => {
      const [roleRecord] = await knex(table).where({ id }).select('*')
      return roleRecord === undefined ? undefined : databaseClient.fromRecord(roleRecord)
    },

    getRoleByName: async name => {
      const [roleRecord] = await knex(table).where({ name }).select('*')
      return roleRecord === undefined ? undefined : databaseClient.fromRecord(roleRecord)
    }
  }
}
