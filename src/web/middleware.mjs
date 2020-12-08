import { validationResult } from 'express-validator'
import { ErrorName } from '../global/error.mjs'

// Validates request based on provided validators. In case errors exist returns json response with
// validation messages.
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
