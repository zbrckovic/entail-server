import { PgErrorCodes } from '../database/misc.mjs'
import { createError, ErrorName } from '../../global/error.mjs'

export const UsersRepository = ({ databaseClient }) => {
  const table = databaseClient.getTableName('user')

  return {
    getUsers: async () => {
      const userRecords = await databaseClient
        .knex(table)
        .select('*')

      return userRecords.map(record => databaseClient.fromRecord(record))
    },

    getUserById: async id => {
      const [userRecord] = await databaseClient.knex(table).where({ id }).select('*')
      return userRecord === undefined ? undefined : databaseClient.fromRecord(userRecord)
    },

    getUserByEmail: async email => {
      const [userRecord] = await databaseClient.knex(table).where({ email }).select('*')
      return userRecord === undefined ? undefined : databaseClient.fromRecord(userRecord)
    },

    createUser: async user => {
      try {
        const userRecord = databaseClient.toRecord(user)

        const [createdUserRecord] = await databaseClient
          .knex(table)
          .insert(userRecord)
          .returning('*')

        return databaseClient.fromRecord(createdUserRecord)
      } catch (error) {
        if (
          error.code === PgErrorCodes.UNIQUE_VIOLATION &&
          error.constraint === 'user_email_unique'
        ) {
          throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
        }
        throw error
      }
    },

    updateUser: async ({ id, ...propsToUpdate }) => {
      const recordPropsToUpdate = databaseClient.toRecord(propsToUpdate)

      const [updatedUserRecord] = await databaseClient.knex(table)
        .where({ id })
        .update(recordPropsToUpdate)
        .returning('*')

      return databaseClient.fromRecord(updatedUserRecord)
    },

    deleteUser: async id => {
      const [deletedUserRecord] = await databaseClient
        .knex(table)
        .where({ id })
        .del()
        .returning('*')

      return databaseClient.fromRecord(deletedUserRecord)
    }
  }
}
