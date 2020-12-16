import stampit from '@stamp/it'
import { ActivationStatus, Role, User } from '../domain/user.mjs'
import { ErrorName } from '../common/error.mjs'

export const DataInitializationService = stampit({
  init({ repository, environment, cryptographyService }) {
    this.environment = environment
    this.repository = repository
    this.cryptographyService = cryptographyService
  },
  methods: {
    async initData() {
      await this._saveAllRoles()

      const { superAdminEmail, superAdminPassword } = this.environment
      if (superAdminEmail !== undefined && superAdminPassword !== undefined) {
        await this._saveSuperAdmin(superAdminEmail, superAdminPassword)
      }
    },

    // Inserts all roles into database if they don't already exist.
    async _saveAllRoles() {
      const roles = Object.values(Role)
      await this.repository.saveRolesIgnoreDuplicates(roles)
    },

    // Inserts super admin with specified credentials into database.
    async _saveSuperAdmin(email, password) {
      const passwordHash = await this.cryptographyService.createPasswordHash(password)
      const user = User({
        email,
        passwordHash,
        activationStatus: ActivationStatus({
          isActivated: true
        }),
        roles: [Role.SUPER_ADMIN]
      })
      try {
        await this.repository.createUser(user)
      } catch (error) {
        if (error.name === ErrorName.EMAIL_ALREADY_USED) return
        throw error
      }
    }
  }
})
