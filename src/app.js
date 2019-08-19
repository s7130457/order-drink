const express = require('express')
const helmet = require('helmet')
const session = require('express-session')

const routes = require('./routes/index.route')
const models = require('./models/index.model')

const app = express()
;(async () => {




  app.use(helmet())
  // app.use(session({
  //   secret: '',
  //   cookie: {
  //     secure: ,
  //     httpOnly: ,
  //     maxAge: 
  //   },
  //   store: ,
  //   resave: ,
  //   saveUninitialized: 
  // }))




  app.use('/api', routes)
  app.get('/', (req, res) => {
    res.send('Test website homepage')
  })

  app.listen(3000, () => {
    console.log('listening on 3000 port.');
  })
})()

module.exports = app
