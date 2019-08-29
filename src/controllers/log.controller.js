import Model from '../models/log.model'

function list (req, res, next) {
  const page = Math.max(0, req.query.page - 1)
  const limit = req.query.limit || 100
  const from = req.query.from || null
  const to = req.query.to || null

  Model.list(page, limit, from, to)
    .then(objs => res.json(objs))
    .catch(e => next(e))
}

export default { list }
