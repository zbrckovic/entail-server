import { ActivationStatus, Role, User } from '../domain/user.mjs'
import { ErrorName } from '../common/error.mjs'

export const DataInitializationService = ({
  usersRepository,
  rolesRepository,
  environment,
  cryptographyService
}) => {
  const result = Object.freeze({
    async initData () {
      await saveAllRoles()

      const {
        superAdminEmail,
        superAdminPassword
      } = environment

      if (superAdminEmail !== undefined && superAdminPassword !== undefined) {
        await saveSuperAdmin(superAdminEmail, superAdminPassword)
      }
    }
  })

  // Inserts all roles into database if they don't already exist.
  const saveAllRoles = async () => {
    const roles = Object.values(Role)
    await rolesRepository.saveRoles(roles)
  }

  // Inserts super admin with specified credentials into database.
  const saveSuperAdmin = async (email, password) => {
    const passwordHash = await cryptographyService.createSecureHash(password)
    const user = User({
      email,
      passwordHash,
      activationStatus: ActivationStatus({
        isActivated: true,
        activationCodeHash: undefined,
        activationCodeExpiresOn: undefined
      }),
      roles: [Role.SUPER_ADMIN]
    })
    try {
      await usersRepository.createUser(user)
    } catch (error) {
      if (error.name === ErrorName.EMAIL_ALREADY_USED) return
      throw error
    }
  }

  return result
}
