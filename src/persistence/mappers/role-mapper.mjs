export const roleMapper = {
  fromPersistence (role) {
    return role.name
  },
  toPersistence (role) {
    return { name: role }
  }
}
