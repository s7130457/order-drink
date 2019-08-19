const Database = require('better-sqlite3')
const db = 'order-drink.db'

// init DB
const sqlite = new Database(db, { verbose: console.log })






module.exports = exports = sqlite
