import httpStatus from 'http-status'

import bcrypt from 'bcryptjs'
import sqlite from '../db'

async function get(value, key = `userUid`) {
  const sql = `SELECT * FROM user WHERE ${key} = $value`
  const param = {
    value
  }
  const user = await sqlite.prepare(sql).get(param)

  return user
}

async function add(user) {
  user.password = bcrypt.hashSync(user.password, 10)

  const sql = `INSERT INTO user (username, fullname, password, email, role) VALUES ($username, $fullname, $password, $email, $role)`
  const param = {
    username: user.username,
    fullname: user.fullname,
    password: user.password,
    email: user.email,
    role: user.role || 'user'
  }
  const result = await sqlite.prepare(sql).run(param)
  return result
}

async function del(user) {
  const sql = `DELETE FROM user WHERE userUid = $userUid`
  const param = {
    userUid: user.userUid
  }
  const result = await sqlite.prepare(sql).run(param)
  return result
}

async function list(skip = 0, limit = 50) {
  const sql = `SELECT userUid, username, fullname, email FROM user LIMIT $skip, $limit`
  const param = {
    skip: skip,
    limit: limit
  }
  let result = await sqlite.prepare(sql).all(param)
  return result
}

async function set(user) {
  user.password = bcrypt.hashSync(user.password, 10)
  const sql = `UPDATE user SET password = $password, fullname = $fullname, email = $email WHERE userUid = $userUid`
  const param = {
    userUid: user.userUid,
    password: user.password,
    fullname: user.fullname,
    email: user.email
  }
  const result = await sqlite.prepare(sql).run(param)
  return result
}

async function comparePassword(inputPassword, DBPassword) {
  const match = await bcrypt.compare(inputPassword, DBPassword)
  if (match) {
    return true
  }
  return false
}

export default { add, del, get, list, set, comparePassword }