import createBookshelf from 'bookshelf'
import { dateToMoment, nullToUndefined, Transformer } from './data-access-objects-util.mjs'

export const createDataAccessObjects = ({ knex }) => {
  const bookshelf = createBookshelf(knex)

  const User = bookshelf.model('User', {
    tableName: 'user',
    parse (res) {
      return Transformer.with(res)
        .transform('created_on', nullToUndefined, dateToMoment)
        .get()
    },

    roles (res) {
      return this.hasMany('UserRole')
    }
  })

  const UserRole = bookshelf.model('UserRole', {
    tableName: 'user_role'
  })

  return { User, UserRole }
}
