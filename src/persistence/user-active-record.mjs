import * as mapper from './mapper.mjs'
import { roleToModelSpecs, sessionToModelSpecs, userToModelSpecs } from './mapper.mjs'

// User with persistence API.
export const UserActiveRecord = userModel => {
  const user = mapper.userFromModel(userModel)

  return Object.freeze({
    ...user,

    // Updates user properties (not modifying its children).
    async update (user) {
      Object.assign(userModel, userToModelSpecs(user))
      await userModel.save()
      return UserActiveRecord(userModel)
    },

    async createSession (session) {
      await userModel.createSession(sessionToModelSpecs(session))
      return UserActiveRecord(userModel)
    },

    async updateSession (session) {
      await userModel.setSession(sessionToModelSpecs(session))
      return UserActiveRecord(userModel)
    },

    async createOrUpdateSession (session) {
      return this.session === undefined
        ? await this.createSession(session)
        : await this.updateSession(session)
    },

    async updateActivationStatus (activationStatus) {
      await userModel.setActivationStatus(sessionToModelSpecs(activationStatus))
      return UserActiveRecord(userModel)
    },

    async addRoles (roles) {
      await userModel.addRoles(roles.map(roleToModelSpecs))
      return UserActiveRecord(userModel)
    },

    async removeRoles (roles) {
      await userModel.removeRoles(roles.map(roleToModelSpecs))
      return UserActiveRecord(userModel)
    }
  })
}
