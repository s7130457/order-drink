import express from 'express'
import Joi from 'joi'
import validate from 'express-validation'
import ctrl from '../controllers/log.controller'

const router = express.Router()

const paramValidation = {
  list: {
    query: {
      from: Joi.string().regex(/^(\d{4}-\d{2}-\d{2})$/),
      to: Joi.string().regex(/^(\d{4}-\d{2}-\d{2})$/),
      limit: Joi.number().required(),
      page: Joi.number().required()
    }
  }
}

router.route('/').get(validate(paramValidation.list), ctrl.list)

export default router
