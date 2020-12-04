import express from 'express'
import { environment } from './environment.mjs'
import { IocContainer } from './ioc-container.mjs'

(async () => {
  const {
    getDatabaseClient,
    getDataInitializer,
    getI18nService,
    getWebInitializer,
  } = IocContainer({ environment })

  await getDatabaseClient().migrateToLatest()
  await getDataInitializer().init()
  await getI18nService().init()

  const app = express()
  getWebInitializer().init({ app })

  return new Promise(resolve => {
    app.listen(environment.port, () => {
      console.info(`Listening on port ${environment.port}.`)
      resolve()
    })
  })
})().then(() => {
  console.info('Application has been successfully initialized.')
})
