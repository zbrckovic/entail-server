export const IocContainer = () => {
  const values = {}

  return {
    // Registers `create` factory which will be called when dependency with `name` is first time
    // requested. `create` gets the container as first parameter.
    setFactory (name, create) {
      Object.defineProperty(this, name, {
        get: () => {
          if (!Object.prototype.hasOwnProperty.call(values, name)) {
            values[name] = create(this)
          }
          return values[name]
        },
        configurable: true,
        enumerable: true
      })

      return this
    },
    setValue (name, value) {
      return this.setFactory(name, () => value)
    }
  }
}
