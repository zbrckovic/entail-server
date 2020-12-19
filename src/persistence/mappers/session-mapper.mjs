import { Session } from '../../domain/user.mjs'
import moment from 'moment'

export const sessionMapper = Object.freeze({
  fromPersistence ({
    refreshTokenHash,
    refreshTokenExpiresOn
  }) {
    return Session({
      refreshTokenHash: refreshTokenHash ?? undefined,
      refreshTokenExpiresOn: refreshTokenExpiresOn === null
        ? undefined
        : moment(refreshTokenExpiresOn)
    })
  },
  toPersistence (
    {
      refreshTokenHash,
      refreshTokenExpiresOn
    },
    userId
  ) {
    return {
      userId,
      refreshTokenHash: refreshTokenHash ?? null,
      refreshTokenExpiresOn: refreshTokenExpiresOn?.toDate() ?? null
    }
  }
})
