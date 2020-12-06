import stampit from '@stamp/it'
import { Repository } from './repository.mjs'

export const RolesRepository = stampit(Repository, {
  name: 'RolesRepository',
  init () {
    this.table = this.getTableName('role')
  },
  methods: {
    getRoles: async () => {
      const roleRecords = await this.knex(this.table).select('*')
      return roleRecords.map(this.fromRecord)
    },

    getRoleById: async id => {
      const [roleRecord] = await this.knex(this.table).where({ id }).select('*')
      return roleRecord === undefined ? undefined : this.fromRecord(roleRecord)
    },

    getRoleByName: async name => {
      const [roleRecord] = await this.knex(this.table).where({ name }).select('*')
      return roleRecord === undefined ? undefined : this.fromRecord(roleRecord)
    }
  }
})
