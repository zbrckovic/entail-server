import express from 'express'
import cookieParser from 'cookie-parser'

// Accepts express application and wires up all routers and middleware.
export const WebInitializer = ({ entryRouter, accountRouter, usersRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))
    app.use(cookieParser())

    app.use(entryRouter)
    app.use(accountRouter)
    app.use('/users', usersRouter)

    return app
  }
})
