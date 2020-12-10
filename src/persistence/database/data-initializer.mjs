import { Role } from '../../core/users/role.mjs'
import stampit from '@stamp/it'
import { DatabaseUtil } from './database-util.mjs'

// Stores data which has to be present for application to work properly.
export const DataInitializer = stampit(DatabaseUtil, {
  name: 'DataInitializer',
  init ({ cryptographyService}) {
    this.cryptographyService = cryptographyService
  },
  methods: {
    async initializeData () {
      const shouldCreateSuperAdmin = (
        this.environment.superAdminEmail !== undefined &&
        this.environment.superAdminPassword !== undefined
      )

      if (!shouldCreateSuperAdmin) return

      const passwordHash = await this.cryptographyService.createPasswordHash(
        this.environment.superAdminPassword
      )
      const superAdminRecordToInsert = this.toRecord({
        email: this.environment.superAdminEmail,
        passwordHash,
        isActivated: true
      })

      const [insertedSuperAdminRecord] = await this.knex(this.tableUser)
        .insert(superAdminRecordToInsert, ['id'])
        .onConflict('email')
        .ignore()

      if (insertedSuperAdminRecord === undefined) return

      const userId = this.fromRecord(insertedSuperAdminRecord).id

      await this.knex(this.tableUserRole)
        .insert(this.toRecord({ userId, role: Role.SUPER_ADMIN }))
        .onConflict(['user_id', 'role'])
        .ignore()
    }
  }
})
