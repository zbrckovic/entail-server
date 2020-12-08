import stampit from '@stamp/it'
import { DatabaseUtil } from './database/database-util.mjs'
import { Cloneable } from '../misc/stampit-util.mjs'
import { PgErrorCodes } from './database/misc.mjs'
import { createError, ErrorName } from '../global/error.mjs'

export const Repository = stampit(DatabaseUtil, Cloneable, {
  name: 'Repository',
  statics: {
    // Calls `callback` with transactional versions of `repositories`. All repository actions
    // performed inside `callback` will belong to the same transaction.
    async withTransaction (repositories, callback) {
      if (repositories.length === 0) {
        return await callback([])
      }

      const knex = repositories[0].knex

      return await knex.transaction(async transactionalKnex => {
        const transactionalRepositories = repositories.map(repository => {
          const clone = repository.clone()
          clone.knex = transactionalKnex
          return clone
        })

        return await callback(transactionalRepositories)
      })
    }
  },
  methods: {
    // Calls `callback` with transactional version of repository. All repository actions performed
    // inside `callback` will belong to the same transaction.
    async withTransaction (callback) {
      return await this.knex.transaction(async knex => {
        const clone = this.clone()
        clone.knex = knex
        return await callback(clone)
      })
    },

    async getUsers () {
      const userRecords = await this.knex(this.tableUser).select('*')
      return userRecords.map(record => this.fromRecord(record))
    },

    async getUserById (id) {
      const [userRecord] = await this.knex(this.tableUser).where({ id }).select('*')
      return userRecord === undefined ? undefined : this.fromRecord(userRecord)
    },

    async getUserByEmail (email) {
      const [userRecord] = await this.knex(this.tableUser).where({ email }).select('*')
      return userRecord === undefined ? undefined : this.fromRecord(userRecord)
    },

    async createUser (user) {
      try {
        const userRecord = this.toRecord(user)

        const [createdUserRecord] = await this.knex(this.tableUser).insert(userRecord).returning('*')

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

      const [updatedUserRecord] = await this.knex(this.tableUser)
        .where({ id })
        .update(recordPropsToUpdate)
        .returning('*')

      return this.fromRecord(updatedUserRecord)
    },

    async deleteUser (id) {
      const [deletedUserRecord] = await this.knex(this.tableUser)
        .where({ id })
        .del()
        .returning('*')

      return this.fromRecord(deletedUserRecord)
    },

    getRoles: async () => {
      const roleRecords = await this.knex(this.tableRole).select('*')
      return roleRecords.map(this.fromRecord)
    },

    getRoleById: async id => {
      const [roleRecord] = await this.knex(this.tableRole).where({ id }).select('*')
      return roleRecord === undefined ? undefined : this.fromRecord(roleRecord)
    },

    getRoleByName: async name => {
      const [roleRecord] = await this.knex(this.tableRole).where({ name }).select('*')
      return roleRecord === undefined ? undefined : this.fromRecord(roleRecord)
    }
  }
})
