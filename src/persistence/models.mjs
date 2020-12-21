import sequelizeLibrary from 'sequelize'

const { DataTypes } = sequelizeLibrary

export const createModels = sequelize => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    passwordHash: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  })

  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { timestamps: false })

  User.belongsToMany(Role, {
    through: 'UsersRoles',
    as: 'roles',
    foreignKey: 'userId'
  })
  Role.belongsToMany(User, {
    through: 'UsersRoles',
    as: 'users',
    foreignKey: 'roleName'
  })
}
