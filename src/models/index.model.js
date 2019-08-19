const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/order-drink'

const client = new pg.Client(connectionString)
client.connect()



module.exports = exports = client
