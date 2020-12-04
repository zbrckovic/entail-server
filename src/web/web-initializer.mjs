import express from 'express'

export const WebInitializer = ({ authRouter, usersRouter }) => ({
  init: app => {
    app.use(express.json({ type: 'application/json' }))

    app.use('/auth', authRouter)
    app.use('/users', usersRouter)

    return app
  }
})
