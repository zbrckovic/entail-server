export const createError = (name, message = '', extra = undefined) => {
  const error = new Error(message)
  error.name = name
  error.message = `${name}: ${message}`
  error.extra = extra
  return error
}

export const ErrorName = {
  UNIQUE_VIOLATION: 'UNIQUE_VIOLATION'
}
