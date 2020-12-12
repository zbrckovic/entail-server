import createBookshelf from 'bookshelf'

// Note: When bookshelf model's `serialize` method is called we get an object which will be called
// "DAO" throughout this codebase. DAOs will keep snake-cased keys. We want to have snake-cased keys
// all the time we are in the "database realm" to avoid confusion. Only when DAOs are converted to
// domain objects case conversion will happen. Conversion to and from domain objects is made only in
// repository when returning results and receiving parameters.

export const createBookshelfModels = ({ knex }) => {
  const bookshelf = createBookshelf(knex)

  const UserModel = bookshelf.model('User', {
    tableName: 'user',
    roles () {
      return this.belongsToMany('Role', 'role_user')
    }
  })

  const RoleModel = bookshelf.model('Role', {
    tableName: 'role'
  })

  return { UserModel, RoleModel }
}
