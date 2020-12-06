import stampit from '@stamp/it'
import { DatabaseUtil } from '../database/database-util.mjs'
import { Cloneable } from '../../misc/stampit-util.mjs'

export const Repository = stampit(DatabaseUtil, Cloneable, {
  name: 'Repository',
  statics: {
    // Calls `callback` with transactional versions of `repositories`. All repository actions
    // performed inside `callback` will belong to the same transaction.
    async withTransaction (repositories, callback) {
      if (repositories.length === 0) {
        return await callback([])
      }

      const knex = repositories[0].knex

      return await knex.transaction(async transactionalKnex => {
        const transactionalRepositories = repositories.map(repository => {
          const clone = repository.clone()
          clone.knex = transactionalKnex
          return clone
        })

        return await callback(transactionalRepositories)
      })
    }
  },
  methods: {
    // Calls `callback` with transactional version of this repository. All repository actions
    // performed inside `callback` will belong to the same transaction.
    async withTransaction (callback) {
      return await this.knex.transaction(async knex => {
        const clone = this.clone()
        clone.knex = knex
        return await callback(clone)
      })
    }
  }
})
