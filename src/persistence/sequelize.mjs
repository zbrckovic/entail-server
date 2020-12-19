import sequelizeLibrary from 'sequelize'

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

  return new Sequelize(pgDatabase, pgUser, pgPassword, {
    host: pgHost,
    port: pgPort,
    dialect: 'postgres',
    schema: pgSchema,
    logging: (mode === 'development' || mode === 'test') && logSql
  })
}
