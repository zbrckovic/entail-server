import express from 'express'
import { environment } from './environment.mjs'
import { createDefaultIocContainer } from './ioc-container.mjs'

(async () => {
  const iocContainer = createDefaultIocContainer()
  await iocContainer.i18nService.initT()
  await iocContainer.sequelize.authenticate()
  await iocContainer.sequelize.sync()

  await iocContainer.repository.storeAllRoles()

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
