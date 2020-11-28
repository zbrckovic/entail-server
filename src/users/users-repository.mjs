/* eslint-disable camelcase */
import moment from 'moment'
import { PgErrorCodes } from '../persistence/pg-error-codes.mjs'
import { createError, ErrorName } from '../error.mjs'

export const UsersRepository = ({ databaseClient }) => {
  const table = databaseClient.getTableName('user')
  const knex = databaseClient.getKnex()

  const adaptUpdateProps = ({ email, passwordHash }) => ({
    email: email === null ? knex.raw('DEFAULT') : email,
    password: passwordHash === null ? knex.raw('DEFAULT') : passwordHash
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

    updateUser: async ({ id, ...updateProps }) => {
      const [updatedUserRecord] = await knex(table)
        .where({ id })
        .update(adaptUpdateProps(updateProps))
        .returning('*')

      return userFromRecord(updatedUserRecord)
    },

    deleteUser: async id => {
      const [deletedUserRecord] = await knex(table).where({ id }).del().returning('*')
      return userFromRecord(deletedUserRecord)
    }
  }
}

export const userToRecord = ({ id, email, passwordHash }) => ({ id, email, password: passwordHash })

export const userFromRecord = ({ id, email, password, created_on, last_updated_on }) => ({
  id,
  email,
  passwordHash: password,
  createdOn: moment(created_on),
  lastUpdatedOn: moment(last_updated_on)
})
