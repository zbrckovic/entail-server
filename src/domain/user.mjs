import stampit from '@stamp/it'

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

export const User = stampit({
  init ({
    id,
    passwordHash,
    isActivated,
    activationCode,
    activationCodeExpiresOn,
    roles
  }) {
    this.id = id
    this.passwordHash = passwordHash
    this.isActivated = isActivated
    this.activationCode = activationCode
    this.activationCodeExpiresOn = activationCodeExpiresOn
    this.roles = roles
  }
})
