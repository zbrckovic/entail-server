import stampit from '@stamp/it'
import { DatabaseUtil } from './database/database-util.mjs'
import { Cloneable } from '../misc/stampit-util.mjs'
import { PgErrorCodes } from './database/misc.mjs'
import { createError, ErrorName } from '../global/error.mjs'

export const Repository = stampit(DatabaseUtil, Cloneable, {
  name: 'Repository',
  init ({ dataAccessObjects }) {
    this.dataAccessObjects = dataAccessObjects
  },
  methods: {
    // Calls `callback` with transactional version of repository. All repository actions performed
    // inside `callback` will belong to the same transaction.
    async withTransaction (callback) {
      return this.knex.transaction(async knex => {
        const clone = this.clone()
        clone.knex = knex
        return await callback(clone)
      })
    },

    async getUsers () {
      const { models } = await new this.dataAccessObjects.User().fetchAll({ withRelated: ['roles'] })
      return models

      const userRecords = await this.knex(this.tableUser)
        .join(this.tableUserRole, `${this.tableUser}.id`, `${this.tableUserRole}.user_id`)
        .select(
          `${this.tableUser}.id`,
          `${this.tableUser}.email`,
          this.knex.raw(`ARRAY_AGG(${this.tableUserRole}.role) as roles`)
        )
        .groupBy(`${this.tableUser}.id`)
      return userRecords.map(record => this.fromRecord(record))
    },

    async getUserById (id) {
      const [userRecord] = await this.knex(this.tableUser).where({ id }).select('*')
      return this.fromRecord(userRecord)
    },

    async getUserByEmail (email) {
      const [userRecord] = await this.knex(this.tableUser).where({ email }).select('*')
      return this.fromRecord(userRecord)
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

    async getRolesForUser (id) {
      const [record] = await this.knex(this.tableUserRole)
        .select(this.knex.raw(`ARRAY_AGG(role) as roles`))
        .where({ ['user_id']: id })
        .groupBy('user_id')
      return record === undefined ? [] : this.fromRecord(record.roles)
    },

    async setRoleForUser (userId, role) {
      this.knex(this.tableUserRole)
        .insert(this.toRecord({ userId, role }))
        .onConflict(['user_id', 'role'])
        .ignore()
    }
  }
})
