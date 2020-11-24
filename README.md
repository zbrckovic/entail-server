# entail-server

## Environment Variables

Name       | Description                                                 | Default 
-----------|-------------------------------------------------------------|--------
NODE_ENV   | Mode: development or production                             | development
PORT       | Port on which server will listen                            | 4000

### Postgres database environment variables

Name       | Default
-----------|---------
PGUSER     | postgres
PGHOST     | localhost
PGPASSWORD | postgres
PGDATABASE | entail
PGPORT     | 5432

## Database and migrations

### Adding new migrations

To add new migration run:

    knex migrate:make <MIGRATION_NAME>
   
Now find newly added file in `./migrations` and finish it.


### Running migrations

To apply all migrations which were not yet applied run: 

    knex migrate:latest

To rollback migrations run:
    
    knex migrate:rollback
