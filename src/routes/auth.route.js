import express from 'express'
import Joi from 'joi'
import validate from 'express-validation'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

const paramValidation = {
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  passwd: {
    body: {
      password: Joi.string().required(),
      original: Joi.string().required()
    }
  }
}

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login)

router.route('/logout')
  .post(authCtrl.logout)

router.route('/passwd').post(validate(paramValidation.passwd), authCtrl.passwd)

export default router
