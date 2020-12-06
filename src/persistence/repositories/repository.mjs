import stampit from '@stamp/it'
import { DatabaseUtil } from '../database/database-util.mjs'
import { Cloneable } from '../../misc/stampit-util.mjs'

export const Repository = stampit(DatabaseUtil, Cloneable, {
  name: 'Repository',
  methods: {
    async withTransaction (callback) {
      return await this.knex.transaction(async knex => {
        const clone = this.clone()
        clone.knex = knex
        return await callback(clone)
      })
    }
  }
})
