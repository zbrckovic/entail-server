import { ActivationStatus, Role, User } from '../domain/user.mjs'
import { ErrorName } from '../common/error.mjs'

export const DataInitializationService = ({
  usersRepository,
  rolesRepository,
  environment,
  cryptographyService
}) => {
  const result = {
    async initData () {
      await createAllRoles()

      const { superAdminEmail, superAdminPassword } = environment

      if (superAdminEmail !== undefined && superAdminPassword !== undefined) {
        await createSuperAdmin(superAdminEmail, superAdminPassword)
      }
    }
  }

  // Inserts all roles into database if they don't already exist.
  const createAllRoles = async () => {
    const roles = Object.values(Role)
    await rolesRepository.createRoles(roles)
  }

  // Inserts super admin with specified credentials into database if it doesn't already exist.
  const createSuperAdmin = async (email, password) => {
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
