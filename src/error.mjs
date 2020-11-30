export const createError = ({ name, message, extra, status }) => {
  const error = new Error(message)
  error.name = name
  error.message = message
  error.extra = extra
  error.status = status
  return error
}

export const ErrorName = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_USED: 'EMAIL_ALREADY_USED',
  USER_ALREADY_ACTIVATED: 'USER_ALREADY_ACTIVATED',
  ACTIVATION_CODE_EXPIRED: 'ACTIVATION_CODE_EXPIRED'
}
