import { defer } from 'rxjs'

export const createRepository = client => {
  const getUsers = () => defer(() => client('user').select('*'))

  return { getUsers }
}
