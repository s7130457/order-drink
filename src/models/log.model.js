import spacetime from 'spacetime'
import sqlite from '../db'

// not check is correct
async function list (page, limit, from, to) {
  let query = {}
  const param = {}
  let sql = `SELECT * FROM log`
  if (from !== null || to !== null) {
    sql += ` WHERE createdAt >= $from AND createdAt <= $to`
    param.from = from || `*`
    param.to = to || `datetime('now', 'localtime')`
  }

  sql += ` ORDER BY createdAt DESC LIMIT $skip, $limit`
  param.skip = page * limit
  param.limit = limit
  const result = await sqlite.prepare(sql).all(param)
  const count = result.length
  return {count, result}
}

async function add(log) {
  const sql = `INSERT INTO log (category, type, msg) VALUES ($category, $type, $msg)`
  const param = {
    category: log.category,
    type: log.type,
    msg: log.msg
  }
  const result = await sqlite.prepare(sql).run(param)
  
  return result
}

async function dashboard () {
  const sql = `SELECT type, msg, createdAt FROM log ORDER BY createdAt DESC LIMIT 10`
  const result = await sqlite.prepare(sql).all()

  return result
}

export default { list, add, dashboard,  }

/**
 * 
 import mongoose from 'mongoose'
 import spacetime from 'spacetime'
 
 const Schema = mongoose.Schema
 
 const schema = Schema(
   {
     category: { type: String, trim: true, enum: { values: ['auth', 'action', 'device', 'event'] } },
     type: { type: String, trim: true, enum: { values: ['info', 'warning', 'error', 'alert'] } },
     user: { type: String },
     msg: {type: String, required: true},
     createdAt: { type: Date, required: true, default: Date.now }
   },
   {
     versionKey: false
   }
 )
 
 schema.options.toJSON = {
   transform: function (doc, ret, options) {
     delete ret._id
   }
 }
 
 schema.statics = {
   async dashboard () {
     const data = await this.find({category: 'device'}).sort({ createdAt: -1 }).select('type msg createdAt -_id').limit(10).lean()
     return data
   },
   async clean (skip) {
     const docs = await this.find({}).select('_id').skip(skip).sort({ createdAt: -1 }).exec()
     const ids = docs.map(doc => doc._id)
     if (ids.length === 0) return
     await this.remove({_id: {$in: ids}})
   }
 }
 
 export default mongoose.model('Log', schema)
 */
