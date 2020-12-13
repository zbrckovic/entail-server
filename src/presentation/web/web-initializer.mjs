import express from 'express'

// Accepts express application and wires up all routers and middleware.
export const WebInitializer = ({ entryRouter, usersRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))

    app.use('/entry', entryRouter)
    app.use('/users', usersRouter)

    return app
  }
})
