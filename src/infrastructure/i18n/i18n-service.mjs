import stampit from '@stamp/it'
import i18next from 'i18next'
import { en } from './en.mjs'

export const I18nService = stampit({
  props: {
    t: undefined
  },
  init ({ environment }) {
    this.environment = environment
  },
  methods: {
    async initT () {
      if (this.t !== undefined) return

      const mode = this.environment.mode

      this.t = await i18next.init({
        lng: 'en',
        debug: mode === 'development' || mode === 'test',
        resources: { en }
      })
    }
  }
})
