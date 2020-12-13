import express from 'express'
import { environment } from './environment.mjs'
import { createDefaultIocContainer } from './ioc-container.mjs'

(async () => {
  const iocContainer = createDefaultIocContainer()
  await iocContainer.i18nService.initT()

  const app = express()
  iocContainer.webInitializer.init(app)

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)
      resolve()
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
