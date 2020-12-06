import { PgErrorCodes } from '../database/misc.mjs'
import { createError, ErrorName } from '../../global/error.mjs'
import stampit from '@stamp/it'
import { Repository } from './repository.mjs'

export const UsersRepository = stampit(Repository, {
  name: 'UsersRepository',
  init () {
    this.table = this.getTableName('user')
  },
  methods: {
    async getUsers () {
      const userRecords = await this.knex(this.table).select('*')
      return userRecords.map(record => this.fromRecord(record))
    },

    async getUserById (id) {
      const [userRecord] = await this.knex(this.table).where({ id }).select('*')
      return userRecord === undefined ? undefined : this.fromRecord(userRecord)
    },

    async getUserByEmail (email) {
      const [userRecord] = await this.knex(this.table).where({ email }).select('*')
      return userRecord === undefined ? undefined : this.fromRecord(userRecord)
    },

    async createUser (user) {
      try {
        const userRecord = this.toRecord(user)

        const [createdUserRecord] = await this.knex(this.table).insert(userRecord).returning('*')

        return this.fromRecord(createdUserRecord)
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

    async updateUser ({ id, ...propsToUpdate }) {
      const recordPropsToUpdate = this.toRecord(propsToUpdate)

      const [updatedUserRecord] = await this.knex(this.table)
        .where({ id })
        .update(recordPropsToUpdate)
        .returning('*')

      return this.fromRecord(updatedUserRecord)
    },

    async deleteUser (id) {
      const [deletedUserRecord] = await this.knex(this.table)
        .where({ id })
        .del()
        .returning('*')

      return this.fromRecord(deletedUserRecord)
    }
  }
})
