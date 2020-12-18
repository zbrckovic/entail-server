import i18next from 'i18next'
import { createError } from '../../common/error.mjs'
import { en } from './en.mjs'

export const I18nService = ({ environment }) => {
  let t = undefined

  return Object.freeze({
    async initT () {
      if (t !== undefined) return

      const mode = environment.mode

      t = await i18next.init({
        lng: 'en',
        debug: (mode === 'development' || mode === 'test') && environment.logI18n,
        resources: { en }
      })
    },
    getT () {
      if (t === undefined) throw createError({ message: 'I18n is not yet initialized.' })
      return t
    },
  })
}
