import { createError, ErrorName } from '../../common/error.mjs'
import { userMapper, roleMapper } from '../mappers/user-mapper.mjs'
import { OrderDirection } from '../../domain/order-direction.mjs'

export const UsersRepository = ({ sequelize }) => {
  const { User, Role } = sequelize.models

  return {
    // Returns user or undefined.
    async getUserByEmail (email) {
      const userDAO = await User.findOne({ where: { email }, include: ['roles'] })
      return userDAO === null ? undefined : userMapper.fromPersistence(userDAO)
    },

    // Returns user or undefined.
    async getUserById (id) {
      const userDAO = await User.findByPk(id, { include: ['roles'] })
      return userDAO === null ? undefined : userMapper.fromPersistence(userDAO)
    },

    // Creates user or throws `EMAIL_ALREADY_USED`.
    async createUser (user) {
      try {
        const userDAO = await User.create(userMapper.toPersistence(user))
        const roles = user.roles
          .map(role => roleMapper.toPersistence(role))
          .map(role => Role.build(role))
        await userDAO.setRoles(roles)
        return await this.getUserById(userDAO.id) // TODO: find better solution
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (Object.prototype.hasOwnProperty.call(error.fields, 'email')) {
            throw createError({ name: ErrorName.EMAIL_ALREADY_USED })
          }
        }
        throw error
      }
    },

    async updateUser (user) {
      const userDAO = await User.findByPk(user.id, { include: ['roles'] })
      await userDAO.update(userMapper.toPersistence(user))
      userDAO.setRoles(user.roles.map(role => roleMapper.toPersistence(role)))
      return userMapper.fromPersistence(userDAO)
    },

    async getUsers ({ pageNumber, pageSize, orderProp, orderDir }) {
      const order = orderProp === undefined
        ? undefined
        : [[orderProp, orderDir ?? OrderDirection.ASC]]

      const { count: total, rows: userDAOs } = await User.findAndCountAll({
        include: ['roles'],
        offset: pageNumber * pageSize,
        limit: pageSize,
        order
      })

      const users = userDAOs.map(userDAO => userMapper.fromPersistence(userDAO))

      return { total, items: users }
    }
  }
}
