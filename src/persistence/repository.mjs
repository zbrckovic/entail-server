import stampit from '@stamp/it'
import { DatabaseUtil } from './database/database-util.mjs'
import { Cloneable } from '../misc/stampit-util.mjs'
import { PgErrorCodes } from './database/misc.mjs'
import { createError, ErrorName } from '../global/error.mjs'
import { userDAOToDomain, userDomainToDAO } from './bookshelf/domain-dao-transform.mjs'
import _ from 'lodash'

export const Repository = stampit(DatabaseUtil, Cloneable, {
  name: 'Repository',
  init ({ bookshelfModels: { UserModel, RoleModel } }) {
    this.UserModel = UserModel
    this.RoleModel = RoleModel
  },
  methods: {
    async getUsers () {
      const { models } = await this.UserModel.fetchAll({ withRelated: ['roles'] })
      return models
        .map(model => model.serialize({ omitPivot: true }))
        .map(userDAOToDomain)
    },

    async getUserByEmail (email) {
      try {
        const m = this.UserModel.forge()
        const model = await m.fetch({ require: true, withRelated: ['roles'] })
        const userDAO = model?.serialize({ omitPivot: true })
        return userDAOToDomain(userDAO)
      } catch (error) {
        throw error
      }
    },

    async createUser (user) {
      try {
        const userModel = await this.UserModel.forge(userDomainToDAO(user)).save()

        const { models: roleModels } = await this.RoleModel.fetchAll()
        const roleDAOs = roleModels.map(roleModel => roleModel.serialize())
        const roleDAOsByName = _.mapValues(_.groupBy(roleDAOs, 'name'), ([role]) => role)
        const roleIds = user.roles.map(role => roleDAOsByName[role].id)
        await userModel.roles().attach(roleIds)
        await userModel.load('roles')
        const userDAO = userModel.serialize()
        userDAOToDomain(userDAO)
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
