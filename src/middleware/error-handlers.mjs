
export const logError = (err, req, res, next) => {
  console.error(err.toString())
  next(err)
}

// noinspection JSUnusedLocalSymbols
export const appErrorHandler = (err, req, res, next) => {
  const { name, message, extra, status } = err

  res
    .status(status !== undefined ? status : 500)
    .json({ name, message, extra })
}
