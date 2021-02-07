import { Role, User } from '../domain/user.mjs'
import { ErrorName } from '../common/error.mjs'
import stampit from '@stamp/it'

export const DataInitializationService = stampit({
  init ({
    usersRepository,
    rolesRepository,
    environment,
    cryptographyService,
    withTransaction
  }) {
    this.usersRepository = usersRepository
    this.rolesRepository = rolesRepository
    this.environment = environment
    this.cryptographyService = cryptographyService
    this.withTransaction = withTransaction
  },
  methods: {
    async initData () {
      await this.withTransaction(async () => {
        await this.createAllRoles()

        const { superAdminEmail, superAdminPassword } = this.environment

        if (superAdminEmail !== undefined && superAdminPassword !== undefined) {
          await this.createSuperAdmin(superAdminEmail, superAdminPassword)
        }
      })
    },
    // Inserts all roles into database if they don't already exist.
    async createAllRoles () {
      const roles = Object.values(Role)
      await this.rolesRepository.createRoles(roles)
    },

    // Inserts super admin with specified credentials into database if it doesn't already exist.
    async createSuperAdmin (email, password) {
      const passwordHash = await this.cryptographyService.createCryptographicHash(password)
      const user = User({ email, passwordHash, isEmailVerified: true, roles: [Role.SUPER_ADMIN] })
      try {
        await this.usersRepository.createUser(user)
      } catch (error) {
        if (error.name === ErrorName.EMAIL_ALREADY_USED) return
        throw error
      }
    }
  }
})
