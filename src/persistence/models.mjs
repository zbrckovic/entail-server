import sequelizeLibrary from 'sequelize'

const { DataTypes } = sequelizeLibrary

export const createModels = sequelize => {
  const UserModel = sequelize.define('User', {
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
      type: DataTypes.Boolean,
      allowNull: false,
      defaultValue: false
    },
    passwordHash: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  })

  const RoleModel = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { timestamps: false })

  UserModel.belongsToMany(RoleModel, {
    through: 'UsersRoles',
    as: 'roles',
    foreignKey: 'userId'
  })
  RoleModel.belongsToMany(UserModel, {
    through: 'UsersRoles',
    as: 'users',
    foreignKey: 'roleName'
  })
}
