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
    logging: (mode === 'development' || mode === 'test') && logSql
  })

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

  const ActivationStatusModel = sequelize.define('ActivationStatus', {
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    activationCodeHash: {
      type: DataTypes.STRING(60)
    },
    activationCodeExpiresOn: {
      type: DataTypes.DATE
    }
  })

  UserModel.hasOne(ActivationStatusModel, {
    foreignKey: 'userId',
    as: 'activationStatus'
  })
  ActivationStatusModel.belongsTo(UserModel, {
    as: 'user'
  })

  const SessionModel = sequelize.define('Session', {
    refreshTokenHash: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    refreshTokenExpiresOn: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  UserModel.hasOne(SessionModel, {
    foreignKey: 'userId',
    as: 'session'
  })
  SessionModel.belongsTo(UserModel, {
    as: 'user'
  })

  return sequelize
}
