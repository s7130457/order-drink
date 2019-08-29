import httpStatus from 'http-status'

// import APIError from '../APIError'
import User from '../models/user.model'
import Log from '../models/log.model'

async function login (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const user = await User.get(username, 'username')
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  
  if (!user) {
    await _authError(username, ip)

    // return res.json(httpStatus.UNAUTHORIZED, {message: 'Authentication error'})
  } else {
    const  valid = await User.comparePassword(password, user.password)

    if (!valid) {
      await _authError(username, ip)

      // return res.json(httpStatus.UNAUTHORIZED, {message: 'Authentication error'})
    }

    await Log.add({
      category: 'auth',
      type: 'info',
      msg: `${user.username} login from ${ip}`
    })

    req.session.authenticated = true
    req.session.userId = user.userUid
    req.session.username = username

    res.json({status: 'ok'})
  }

  async function _authError (user, ip) {
    // const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
    await Log.add({
      category: 'auth',
      type: 'error',
      msg: `${user} login failed from ${ip}`
    })

    return res.json(httpStatus.UNAUTHORIZED, {message: 'Authentication error'})
    // return err
  }
}

async function logout (req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  await Log.add({
    category: 'auth',
    type: 'info',
    msg: `${req.session.username} logout from ${ip}`
  })

  delete req.session.authenticated
  delete req.session.userId
  delete req.session.username

  res.json({status: 'ok'})
}

async function passwd (req, res, next) {
  if (req.session.authenticated === undefined || req.session.authenticated === false) {
    return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true))
  }

  if (req.body.original === undefined) {
    return res.json({status: 'error', data: 'original required'})
  }

  try {
    const user = await User.get(req.session.userId)
    const valid = await User.comparePassword(req.body.original, user.password)

    if (!valid) {
      return res.json(httpStatus.BAD_REQUEST, {message: 'wrong original password'})
    }

    user.password = req.body.password
    await User.set(user)

    res.json({status: 'ok'})
  } catch (e) {
    next(e)
  }
}

module.exports = { login, logout, passwd }
