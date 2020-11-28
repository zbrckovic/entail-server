/* eslint-disable camelcase */
import moment from 'moment'
import { PgErrorCodes } from '../persistence/pg-error-codes.mjs'
import { createError, ErrorName } from '../error.mjs'

export const UsersRepository = ({ databaseClient }) => {
  const table = databaseClient.getTableName('user')
  const knex = databaseClient.getKnex()

  const userToRecord = user => databaseClient.toRecord(user, value => {
    if (moment.isMoment(value)) return value.format()
    return value
  })

  const userFromRecord = user => databaseClient.fromRecord(user, (value, key) => {
    if (key === 'created_on' || key === 'last_updated_on') {
      return value !== undefined ? moment(value) : undefined
    }
    return value
  })

  return {
    getUsers: async () => {
      const userRecords = await knex(table).select('*')
      return userRecords.map(userFromRecord)
    },

    getUserById: async id => {
      const [userRecord] = await knex(table).where({ id }).select('*')
      return userRecord === undefined ? undefined : userFromRecord(userRecord)
    },

    getUserByEmail: async email => {
      const [userRecord] = await knex(table).where({ email }).select('*')
      return userRecord === undefined ? undefined : userFromRecord(userRecord)
    },

    createUser: async user => {
      try {
        const userRecord = userToRecord(user)
        const [createdUserRecord] = await knex(table).insert(userRecord).returning('*')
        return userFromRecord(createdUserRecord)
      } catch (error) {
        if (error.code === PgErrorCodes.UNIQUE_VIOLATION) {
          throw createError(ErrorName.EMAIL_ALREADY_USED)
        }
        throw error
      }
    },

    updateUser: async ({ id, ...propsToUpdate }) => {
      const recordPropsToUpdate = userToRecord(propsToUpdate)

      const [updatedUserRecord] = await knex(table)
        .where({ id })
        .update(recordPropsToUpdate)
        .returning('*')

      return userFromRecord(updatedUserRecord)
    },

    deleteUser: async id => {
      const [deletedUserRecord] = await knex(table).where({ id }).del().returning('*')
      return userFromRecord(deletedUserRecord)
    }
  }
}
