import express from 'express'

// Accepts express application and wires up all routers and middleware.
export const WebInitializer = ({ entryRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))

    app.use('/entry', entryRouter)

    return app
  }
})
