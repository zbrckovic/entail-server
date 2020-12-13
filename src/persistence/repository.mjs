import stampit from '@stamp/it'

export const Repository = stampit({
  name: 'Repository',
  init ({ sequelize }) {
    this.sequelize = sequelize
  },
  methods: {
    async getUsers () {
    },

    async getUserByEmail (email) {
    },

    async createUser (user) {
    }
  }
})
