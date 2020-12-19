export const roleMapper = Object.freeze({
  fromPersistence (role) {
    return role.name
  },
  toPersistence (role) {
    return { name: role }
  }
})
