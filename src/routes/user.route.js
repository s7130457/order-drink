import express from 'express'
import Joi from 'joi'
import validate from 'express-validation'
import ctrl from '../controllers/user.controller'

const router = express.Router()

const paramValidation = {
  add: {
    body: {
      username: Joi.string().required(),
      fullname: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required()
    }
  },
  set: {
    body: {
      fullname: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required()
    },
    params: {
      id: Joi.number().integer().required()
    }
  }
}

router.route('/')
  .get(ctrl.list)
  .post(validate(paramValidation.add), ctrl.add)

router.route('/:id')
  .get(ctrl.get)
  .put(validate(paramValidation.set), ctrl.set)
  .delete(ctrl.del)

router.param('id', ctrl.load)

export default router
