const express = require('express')
const router = express.Router();
const httpStatus = require('http-status')

import authRoutes from './auth.route'
import logRoutes from './log.route'
import userRoutes from './user.route'

router.get('/', function(req, res) {
  console.log('hi');
  
  return res.send('Test website api')
})




router.use('/auth', authRoutes)
router.use('/logs', checkAuth, logRoutes)
router.use('/users', checkAuth, userRoutes)

function checkAuth (req, res, next) {
    // next()
  if (!req.session || !(req.session.authenticated)) {
    return res.json(httpStatus.UNAUTHORIZED, {message: 'Authentication error'})
    // next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true))
  } else {
    next()
  }
}


module.exports = router
