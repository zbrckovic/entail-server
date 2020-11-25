import knex from 'knex'

export const createDBQueryBuilder = environment => (
  knex({
    client: 'pg',
    connection: {
      host: environment.pgHost,
      user: environment.pgUser,
      password: environment.pgPassword,
      database: environment.pgDatabase,
      port: environment.pgPort
    }
  })
)

export const createDBSchemaBuilder = ({ dbQueryBuilder, environment }) => (
  dbQueryBuilder.schema.withSchema(resolveDBSchema(environment))
)

export const resolveDBSchema = environment => environment.mode === 'test' ? 'test' : 'public'
