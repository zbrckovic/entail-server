import express from 'express'
import cookieParser from 'cookie-parser'

// Accepts express application and wires up all routers and middleware.
export const WebInitializer = ({ entryRouter, accountRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))
    app.use(cookieParser())

    app.use('/entry', entryRouter)
    app.use('/account', accountRouter)

    return app
  }
})
