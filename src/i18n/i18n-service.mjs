import i18next from 'i18next'
import { en } from './en.mjs'

export const I18nService = ({ environment }) => {
  let t

  const init = async () => {
    if (t !== undefined) return

    t = await i18next.init({
      lng: 'en',
      debug: environment.mode === 'development' || environment.mode === 'test',
      resources: { en }
    })
  }

  const getT = () => t

  return { init, getT }
}
