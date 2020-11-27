import { userFromRecord, userToRecord } from './mapping.mjs'

// Provides persistence API for the application.
export const Repository = ({ databaseClient }) => {
  const table = databaseClient.getTableName
  const knex = databaseClient.getKnex()

  return {
    getUsers: async () => {
      const userRecords = await knex(table('user')).select('*')
      return userRecords.map(userFromRecord)
    },
    createUser: async user => {
      const userRecord = userToRecord(user)
      const [newUserRecord] = await knex(table('user')).insert(userRecord).returning('*')
      return userFromRecord(newUserRecord)
    }
  }
}
