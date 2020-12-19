import { ActivationStatus } from '../../domain/user.mjs'
import moment from 'moment'

export const activationStatusMapper = Object.freeze({
  fromPersistence ({
    isActivated,
    activationCodeHash,
    activationCodeExpiresOn
  }) {
    return ActivationStatus({
      isActivated,
      activationCodeHash: activationCodeHash ?? undefined,
      activationCodeExpiresOn: activationCodeExpiresOn === null
        ? undefined
        : moment(activationCodeExpiresOn)
    })
  },
  toPersistence (
    {
      isActivated,
      activationCodeHash,
      activationCodeExpiresOn
    },
    userId
  ) {
    return {
      userId,
      isActivated,
      activationCodeHash: activationCodeHash ?? null,
      activationCodeExpiresOn: activationCodeExpiresOn?.toDate() ?? null
    }
  }
})
