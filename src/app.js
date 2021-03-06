const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')

const helmet = require('helmet')
const session = require('express-session')

const routes = require('./routes/index.route')
const cors = require('cors')

const { pool } = require('./models/config')


const app = express()

;(async () => {
  app.use(cors())

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(logger('dev'))
  app.use(helmet())
  // app.use(session({
  //   secret: 'order-drink',
  //   cookie: {
  //     secure: false,
  //     httpOnly: true,
  //     maxAge: 1000 * 60 * 60 * 24  // 一天
  //   },
  //   store: ,
  //   resave: false,
  //   saveUninitialized: true
  // }))




  app.use('/api', routes)
  app.get('/', (req, res) => {
    res.send('Test website homepage')
  })

  // app.get('/db', async (req, res) => {
  //   try {
  //     const client = await pool.connect()
  //     const result = await client.query('SELECT * FROM test_table');
  //     const results = { 'results': (result) ? result.rows : null};
  //     res.render('pages/db', results );
  //     client.release();
  //   } catch (err) {
  //     console.error(err);
  //     res.send("Error " + err);
  //   }
  // })

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`listening on ${PORT} port.`);
  })
})()

module.exports = app
