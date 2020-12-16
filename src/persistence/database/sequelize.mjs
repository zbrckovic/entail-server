import sequelizeLibrary from 'sequelize'

const { DataTypes, Sequelize } = sequelizeLibrary

export const createSequelize = ({ environment }) => {
  const {
    pgUser,
    pgHost,
    pgPassword,
    pgDatabase,
    pgPort,
    pgSchema,
    mode,
    logSql
  } = environment

  const sequelize = new Sequelize(pgDatabase, pgUser, pgPassword, {
    host: pgHost,
    port: pgPort,
    dialect: 'postgres',
    schema: pgSchema,
    logging: (mode === 'development' || mode === 'test') && logSql,
  })

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

  const ActivationStatus = sequelize.define('ActivationStatus', {
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    code: {
      type: DataTypes.STRING,
    },
    expiresOn: {
      type: DataTypes.DATE
    }
  })

  User.hasOne(ActivationStatus, {
    foreignKey: 'userId',
    as: 'activationStatus'
  })
  ActivationStatus.belongsTo(User, {
    as: 'user'
  })

  return sequelize
}
