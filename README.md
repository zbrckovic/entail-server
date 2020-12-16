# entail-server

## Environment variables

Name                                    | Description                                              | Default
----------------------------------------|----------------------------------------------------------|--------
NODE_ENV                                | Mode: `development`, `production` or `test`              | `development`
PORT                                    | Port on which server will listen                         | `4000`
BCRYPT_SALT_ROUNDS                      | Configuration parameter for password encryption (bcrypt) | `10`
ACTIVATION_CODE_VALIDITY_PERIOD_MINUTES | For how long activation code will stay valid             | `60`
SUPER_ADMIN_EMAIL                       | *                                                        | `undefined`
SUPER_ADMIN_PASSWORD                    | *                                                        | `undefined`

* If `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are defined this user will be created as super
  admin on application startup (unless it already exists).

### SMTP email service provider

Name                  | Default
----------------------|--------
EMAIL_SERVER_HOST     | `undefined`
EMAIL_SERVER_PORT     | `undefined`
EMAIL_SERVER_USERNAME | `undefined`
EMAIL_SERVER_PASSWORD | `undefined`

### Postgres database

Name       | Default
-----------|---------
PGUSER     | `postgres`
PGHOST     | `localhost`
PGPASSWORD | `postgres`
PGDATABASE | `entail`
PGPORT     | `5432`

In order to run the application you will need PostgreSQL. You need to create a database with some 
name which you will later pass to the application using `PGDATABASE`.  Application will use the 
default `public` schema which should already be there after you created your database. To run tests 
you will also need another schema named `test`.

### Details

Name                 |                                                                                                                             | Default
---------------------|-----------------------------------------------------------------------------------------------------------------------------|--------
LOG_SQL              | If `true` all SQL queries will be logged (overridden by NODE_ENV = 'production').                                           | `false`
LOG_I18N             | Enables/disables i18n logs (overridden by NODE_ENV = 'production').                                                         | `false`  
DB_SCHEMA_SYNC_ALTER | If `true` application will update database schema on start if it doesn't match application's schema.                        | `false`
INSERT_INIT_DATA     | If `true` initial data required for proper application functioning will be inserted on start (if it doesn't already exist). | `false`
