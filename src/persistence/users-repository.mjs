import { createError, ErrorName } from '../common/error.mjs'
import { roleToModelSpecs, userFromModel, userToModelSpecs } from './mapper.mjs'
import { UserActiveRecord } from './user-active-record.mjs'

export const UsersRepository = ({ sequelize }) => {
  const {
    UserModel,
    RoleModel
  } = sequelize.models

  return Object.freeze({
    async saveRolesIgnoreDuplicates (roles) {
      return await RoleModel.bulkCreate(
        roles.map(roleToModelSpecs),
        { ignoreDuplicates: true }
      )
    },

    async getUsers () {
      const userModels = await UserModel.findAll({
        include: userAssociations
      })
      return userModels.map(userFromModel)
    },

    async getUserByEmail (email) {
      const userModel = await UserModel.findOne({
        where: { email },
        include: userAssociations
      })
      return userModel === null ? undefined : userFromModel(userModel)
    },

    async createUser (user) {
      try {
        const userModelSpecs = userToModelSpecs(user)
        const userModel = await UserModel.create({
          ...userModelSpecs,
          roles: []
        }, { include: userAssociations })
        await userModel.setRoles(userModelSpecs.roles)
        return userFromModel(userModel)
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (Object.prototype.hasOwnProperty.call(error.fields, 'email')) {
            throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
          }
        }
        throw error
      }
    },

    async updateUserByEmail (email, updater) {
      const userModel = await this.getUserByEmail(email)
      const userActiveRecord = userModel === undefined ? undefined : UserActiveRecord(userModel)
      await updater(userActiveRecord)

      return userFromModel(userModel)
    }
  })
}

const userAssociations = ['roles', 'activationStatus', 'session']
