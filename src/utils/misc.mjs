import _ from 'lodash'

// For homeless items

export const keysToCamelCase = obj => _.mapKeys(obj, (value, key) => _.camelCase(key))
export const keysToSnakeCase = obj => _.mapKeys(obj, (value, key) => _.snakeCase(key))
