import express from 'express'

export const WebInitializer = ({ entryRouter, usersRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))

    app.use('/entry', entryRouter)
    app.use('/users', usersRouter)

    return app
  }
})
