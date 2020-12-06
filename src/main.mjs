import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container.mjs'

(async () => {
  const iocContainer = IocContainer({ environment })
  await iocContainer.getDatabaseManager().migrateToLatest()
  await iocContainer.getDataInitializer().initializeData()
  await iocContainer.getI18nService().init()

  const app = express()
  iocContainer.getWebInitializer().init({ app })

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)
      resolve()
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
