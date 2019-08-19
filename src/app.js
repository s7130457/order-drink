const express = require('express')
const helmet = require('helmet')
const session = require('express-session')

const routes = require('./routes/index.route')
const models = require('./models/index.model')

const pgStore = require('connect-pg-simple')(session)
const app = express()
;(async () => {



  app.use(helmet())
  app.use(session({
    secret: 'order-drink',
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24  // 一天
    },
    store: new pgStore(),
    resave: false,
    saveUninitialized: true
  }))




  app.use('/api', routes)
  app.get('/', (req, res) => {
    res.send('Test website homepage')
  })


  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`listening on ${PORT} port.`);
  })
})()

module.exports = app
