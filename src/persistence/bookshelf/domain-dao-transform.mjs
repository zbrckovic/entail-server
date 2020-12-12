import moment from 'moment'

export const userDAOToDomain = userDAO => {
  const {
    'email': email,
    'password_hash': passwordHash,
    'created_on': createdOnDate,
    'last_updated_on': lastUpdatedOnDate,
    'is_activated': isActivated,
    'activation_code': activationCodeOrNull,
    'activation_code_expires_on': activationCodeExpiresOnDateOrNull,
    'roles': roleDAOs
  } = userDAO

  return {
    email,
    passwordHash,
    createdOn: moment(createdOnDate),
    lastUpdatedOn: moment(lastUpdatedOnDate),
    isActivated,
    activationCode: moment(activationCodeOrNull === null
      ? undefined
      : moment(activationCodeOrNull)
    ),
    roles: roleDAOs.map(roleDAOToDomain)
  }
}

export const userDomainToDAO = user => {
  const {
    email,
    passwordHash,
    createdOn,
    lastUpdatedOn,
    isActivated,
    activationCode,
    activationCodeExpiresOn
  } = user

  return {
    'email': email,
    'password_hash': passwordHash,
    'created_on': createdOn,
    'last_updated_on': lastUpdatedOn,
    'is_activated': isActivated,
    'activation_code': activationCode,
    'activation_code_expires_on': activationCodeExpiresOn
  }
}

export const roleDAOToDomain = roleDAO => roleDAO.name

export const roleDomainToDAO = (role, roleDAOsByName) => roleDAOsByName[role]
