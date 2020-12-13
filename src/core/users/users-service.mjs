import stampit from '@stamp/it'

export const UsersService = stampit({
  init ({ repository }) {
    this.repository = repository
  },
  methods: {
    async getAll () { return await this.repository.getUsers() }
  }
})
