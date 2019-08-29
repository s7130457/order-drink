import Model from '../models/user.model'
import httpStatus from 'http-status'

async function add (req, res, next) {
  const user = await Model.get(req.body.username, 'username')
  if (user) {

    return res.json(httpStatus.BAD_REQUEST, {message: 'username exist'})
  }

  Model.add(req.body)
    .then(saved => res.json(saved))
    .catch(e => next(e))
}

function del (req, res, next) {
  const obj = req.obj
  if (obj.username === 'admin' && obj.userUid ===1) {

    return res.json(httpStatus.BAD_REQUEST, {message: 'can not delete admin'})
  }
  
  Model.del(obj)
    .then(() => res.json(httpStatus.OK, {data: 'ok'}))
    .catch(e => next(e))
}

function get (req, res, next) {
  const user = {
    userUid: req.obj.userUid,
    username: req.obj.username,
    fullname: req.obj.fullname, 
    email: req.obj.email
  }

  return res.json(user)
}

function list (req, res, next) {

  Model.list()
    .then(objs => res.json(objs))
    .catch(e => next(e))
}

function load (req, res, next, data) {

  if (!Number.isInteger(+data)) {

    return res.json(httpStatus.BAD_REQUEST, {message: 'userUid error'})
  }

  Model.get(data)
    .then((obj) => {
      if (!obj) {

        return res.json(httpStatus.NOT_FOUND, {message: 'userUid not exist'})
      }

      req.obj = obj
      // NOTE: return null to fix these warnings on bluebird 3.x
      // Warning: a promise was created in a handler at group.controller.js but was not returned from it, see http://goo.gl/rRqMUw at Promise.then
      next()
      return null
    })
    .catch(e => next(e))
}

async function set (req, res, next) {
  const obj = req.obj
  obj.fullname = req.body.fullname
  obj.email = req.body.email

  if (req.body.password) {
    obj.password = req.body.password
  }
  // if (req.body.password) {
  //   if (req.body.original === undefined) {
  //     return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true))
  //   }

  //   const valid = await obj.comparePassword(req.body.original)
  //   if (!valid) {
  //     return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true))
  //   }
  //   obj.password = req.body.password
  // }

  Model.set(obj)
    .then(() => res.json(httpStatus.OK, {data: 'ok'}))
    .catch(e => next(e))
}

export default { add, del, get, list, load, set }
