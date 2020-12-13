import stampit from '@stamp/it'
import { PgErrorCodes } from './database/misc.mjs'
import { createError, ErrorName } from '../global/error.mjs'

export const Repository = stampit({
  name: 'Repository',
  init({}) {},
  methods: {
    async getUsers() {
    },

    async getUserByEmail(email) {
    },

    async createUser(user) {
      try {

      } catch (error) {
        if (
          error.code === PgErrorCodes.UNIQUE_VIOLATION &&
          error.constraint === 'user_email_unique'
        ) {
          throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
        }
        throw error
      }
    }
  }
})
