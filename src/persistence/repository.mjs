import { defer } from 'rxjs'
import { resolveDBSchema } from './database.mjs'

export const createRepository = ({ dbQueryBuilder: qb, environment }) => {
  const schema = resolveDBSchema(environment)
  const table = name => `${schema}.${name}`

  const getUsers = () => defer(() => qb(table('user')).select('*'))

  return { getUsers }
}
