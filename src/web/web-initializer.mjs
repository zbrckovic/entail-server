import express from 'express'

export const WebInitializer = ({ authenticationRouter, usersRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))

    app.use('/auth', authenticationRouter)
    app.use('/users', usersRouter)

    return app
  }
})
