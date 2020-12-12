import knex from 'knex'

export const createKnex = ({ environment }) => knex({
  client: 'pg',
  debug: true,
  connection: {
    host: environment.pgHost,
    user: environment.pgUser,
    password: environment.pgPassword,
    database: environment.pgDatabase,
    port: environment.pgPort
  },
  pool: {
    afterCreate: function (connection, done) {
      connection.query(`SET SESSION SCHEMA '${environment.pgSchema}';`, error => {
        done(error, connection);
      });
    }
  }
})
