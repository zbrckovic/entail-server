import { validationResult } from 'express-validator'
import { ErrorName } from './error.mjs'

export const validate = (...validators) => {
  return [
    ...validators,
    (req, res, next) => {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        next()
        return
      }

      res.status(400).json({ name: ErrorName.INVALID_REQUEST, extra: errors.array() })
    }
  ]
}

export const logError = (err, req, res, next) => {
  console.error(err.toString())
  next(err)
}
