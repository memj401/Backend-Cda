const { Pool } = require('pg')

const bancoDeDados = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mecajun',
  password: '123',
  port: 5433,
})
	
module.exports = bancoDeDados