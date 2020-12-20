// Main 'constructor' for errors in the application.
export const createError = ({ name, message, extra }) => {
  const error = new Error(message)
  error.name = name
  error.message = message
  error.extra = extra
  return error
}

export const ErrorName = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_ACTIVATION_CODE: 'INVALID_ACTIVATION_CODE',
  EMAIL_ALREADY_USED: 'EMAIL_ALREADY_USED',
  USER_ALREADY_ACTIVATED: 'USER_ALREADY_ACTIVATED',
  USER_NOT_ACTIVATED: 'USER_NOT_ACTIVATED',
  ACTIVATION_CODE_EXPIRED: 'ACTIVATION_CODE_EXPIRED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  NO_TOKEN: 'NO_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED'
}
