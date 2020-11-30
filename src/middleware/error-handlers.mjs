export const logError = (err, req, res, next) => {
  console.error(err.toString())
  next(err)
}
