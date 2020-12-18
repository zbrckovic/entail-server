import { validationResult } from 'express-validator'
import { ErrorName } from '../../../common/error.mjs'

export const ValidationService = () => (
  Object.freeze({
    // Creates a middleware which validates request based on provided validators. In case validation
    // results in errors it returns json response with validation messages extracted from those
    // errors.
    isValid (...validators) {
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
  })
)
