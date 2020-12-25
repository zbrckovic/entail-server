import validator from 'validator'

const SUFFICIENT_PASSWORD_STRENGTH = 0.4

export const isSufficientlyStrongPassword = value =>
  calculatePasswordStrength(value) >= SUFFICIENT_PASSWORD_STRENGTH

const calculatePasswordStrength = value => Math.min(
  validator.isStrongPassword(value, { returnScore: true }) / 60,
  1
)
