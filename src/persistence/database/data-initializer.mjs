import { Role } from '../../core/users/role.mjs'
import stampit from '@stamp/it'

// Stores data which has to be present for application to work properly.
export const DataInitializer = stampit({
  init ({ databaseClient, cryptographyService, environment }) {
    this.client = databaseClient
    this.cryptographyService = cryptographyService
    this.environment = environment
  },
  methods: {
    async initializeData () {
      const tableRole = this.client.getTableName('role')
      const tableUser = this.client.getTableName('user')
      const tableUserRole = this.client.getTableName('user_role')

      const roleRecords = Object
        .keys(Role)
        .map(name => this.client.toRecord({ name }))

      await this.client.knex(tableRole)
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
      const superAdminRecordToInsert = this.client.toRecord({
        email: this.environment.superAdminEmail,
        passwordHash,
        isActivated: true
      })

      const [insertedSuperAdminRecord] = await this.client.knex(tableUser)
        .insert(superAdminRecordToInsert, ['id'])
        .onConflict('email')
        .ignore()

      if (insertedSuperAdminRecord === undefined) return

      const userId = this.client.fromRecord(insertedSuperAdminRecord).id

      const [roleRecord] = await this.client.knex(tableRole)
        .where({ name: Role.SUPER_ADMIN })
        .select(['id'])

      const roleId = this.client.fromRecord(roleRecord).id

      await this.client.knex(tableUserRole)
        .insert(this.client.toRecord({ userId, roleId }))
        .onConflict(['user_id', 'role_id'])
        .ignore()
    }
  }
})
