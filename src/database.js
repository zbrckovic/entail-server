import pg from 'pg'

const { Client } = pg

export const Database = async () => {
  const client = new Client()

  await client.connect()

  const getUsers = async () => {
    const result = await client.query('SELECT * FROM entail.public."user"')
    return result.rows
  }

  return { getUsers }
}
