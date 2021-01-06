import sequelizeLibrary from 'sequelize'
import { PropositionalRulesSet } from '../domain/project.mjs'

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

  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    isFirstOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    propositionalRulesSet: {
      type: DataTypes.ENUM(Object.values(PropositionalRulesSet)),
      allowNull: false
    }
  })

  User.hasMany(Project, {
    foreignKey: {
      name: 'ownerId',
      allowNull: false
    }
  })
  Project.belongsTo(User, {
    foreignKey: {
      name: 'ownerId',
      allowNull: false
    }
  })

  const Deduction = sequelize.define('Deduction', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    steps: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    syms: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    presentations: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    theorem: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  })

  Project.hasMany(Deduction, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })
  Deduction.belongsTo(Project, {
    foreignKey: {
      name: 'projectId',
      allowNull: false
    }
  })
}
