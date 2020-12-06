import stampit from '@stamp/it'

export const UsersService = stampit({
  init ({ usersRepository }) {
    this.usersRepository = usersRepository
  },
  methods: {
    async getAll () { return await this.usersRepository.getUsers() }
  }
})
