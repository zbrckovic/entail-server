import { Role } from '../../core/users/role.mjs'
import stampit from '@stamp/it'
import { DatabaseUtil } from './database-util.mjs'

// Stores data which has to be present for application to work properly.
export const DataInitializer = stampit(DatabaseUtil, {
  name: 'DataInitializer',
  init ({ cryptographyService, environment }) {
    this.cryptographyService = cryptographyService
    this.environment = environment
  },
  methods: {
    async initializeData () {
      const roleRecords = Object
        .keys(Role)
        .map(name => this.toRecord({ name }))

      await this.knex('role')
        .insert(roleRecords)
        .onConflict('name')
        .ignore()

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

      const [insertedSuperAdminRecord] = await this.knex('user')
        .insert(superAdminRecordToInsert, ['id'])
        .onConflict('email')
        .ignore()

      if (insertedSuperAdminRecord === undefined) return

      const userId = this.fromRecord(insertedSuperAdminRecord).id

      const [roleRecord] = await this.knex('role')
        .where({ name: Role.SUPER_ADMIN })
        .select(['id'])

      const roleId = this.fromRecord(roleRecord).id

      await this.knex('role_user')
        .insert(this.toRecord({ userId, roleId }))
        .onConflict(['user_id', 'role_id'])
        .ignore()
    }
  }
})
