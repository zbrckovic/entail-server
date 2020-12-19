import sequelizeLibrary from 'sequelize'
import { createModels } from './models.mjs'

const {
  Sequelize
} = sequelizeLibrary

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
