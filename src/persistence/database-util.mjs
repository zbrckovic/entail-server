import moment from 'moment'
import _ from 'lodash'
import { DB_DEFAULT_VALUE } from './misc.mjs'

export const DatabaseUtil = ({ knex, environment }) => {
  // Resolves full table name with included schema prefix.
  const getTableName = name => `${environment.pgSchema}.${name}`

  // Transforms object to the format suitable for database. It changes all keys to snake case.
  const toRecord = object => {
    const result = {}

    _.forEach(object, (value, key) => {
      result[toRecordKey(key)] = toRecordValue(value)
    })

    return result
  }

  // Transforms record to the format suitable for application. It changes all keys to camel case.
  const fromRecord = record => {
    const result = {}

    _.forEach(record, (value, key) => {
      result[fromRecordKey(key)] = fromRecordValue(value)
    })

    return result
  }

  const toRecordKey = key => _.snakeCase(key)
  const fromRecordKey = key => _.camelCase(key)

  const toRecordValue = value => {
    if (value === DB_DEFAULT_VALUE) return knex.raw('DEFAULT')
    if (moment.isMoment(value)) return value.toDate()
    return value
  }

  const fromRecordValue = value => {
    if (value === null) return undefined
    if (value instanceof Date) return moment(value)
    return value
  }

  return { getTableName, toRecord, fromRecord }
}
