export const createError = (name, message = '', extra = undefined) => {
  const error = new Error(message)
  error.name = name
  error.message = `${name}: ${message}`
  error.extra = extra
  return error
}

export const ErrorName = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_USED: 'EMAIL_ALREADY_USED'
}
