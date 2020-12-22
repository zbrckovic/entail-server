import sequelizeLibrary from 'sequelize'
import { createModels } from './models.mjs'
import cls from 'cls-hooked'

const { Sequelize } = sequelizeLibrary
const namespace = cls.createNamespace('zbrckovic/entail-server')
Sequelize.useCLS(namespace)

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

  createModels(sequelize)

  return sequelize
}

export const createFnWithTransaction = ({ sequelize }) => async task => (
  namespace.get('transaction') ? await task() : await sequelize.transaction(task)
)
