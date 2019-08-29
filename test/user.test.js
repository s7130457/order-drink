import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import Config from './config.test'

chai.use(chaiHttp)
chai.should()

const agent = chai.request.agent(`${Config.HOST}`)

before(async () => {
  await agent.post('/auth/login')
    .send(Config.userCredentials)
})

after(async () => {
  await agent.post('/auth/logout')
})

describe('# GET /users', () => {
  it('should list all users success', async () => {
    const res = await agent.get('/users')
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body[0]).to.have.keys(['username', 'id', 'fullname', 'email'])
    
  }).timeout(3000)

})

describe('# POST /users', () => {
  it('should add user success', async () => {
    const res = await agent.post('/users')
      .send(Config.addUser)
    const id = res.body.lastInsertRowid
    
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.changes).to.be.equal(1)

    await agent.del(`/users/${id}`)
    
  }).timeout(3000)

  it('should fail for add exist username', async () => {
    const before = await agent.post('/users')
      .send(Config.addUser)
    const id = before.body.lastInsertRowid

    const res = await agent.post('/users')
      .send(Config.addUser)
    expect(res).to.have.status(400)
    expect(res.body.message).to.be.equal('username already exist')

    await agent.del(`/users/${id}`)
    
  }).timeout(3000)

})

describe('# GET /users/:id', () => {
  it('should get user data success', async () => {
    const res = await agent.get('/users/1')
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.keys(['username', 'id', 'fullname', 'email'])
    
  }).timeout(3000)

  it('should get user fail for error user id', async () => {
    const res = await agent.get('/users/' + null)
    expect(res).to.have.status(400)
    expect(res.body).to.be.an('object')
    expect(res.body.message).to.be.equal('user id error')
    
  }).timeout(3000)

  it('should get user fail for user id not exist', async () => {
    const res = await agent.get('/users/' + 10000)
    expect(res).to.have.status(404)
    expect(res.body).to.be.an('object')
    expect(res.body.message).to.equal('user id not exist')
    
  }).timeout(3000)

})

describe('# DEL /users/:id ', () => {
  it('should del user success', async() => {
    const before = await agent.post('/users')
      .send(Config.addUser)
    const id = await before.body.lastInsertRowid
    
    const res = await agent.del('/users/' + id)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.data).to.be.equal('ok')

  }).timeout(3000)

})  

describe('# PUT /users/:id ', () => {
  let id = null
  before(async () => {
    const before = await agent.post('/users')
      .send(Config.addUser)
      id = before.body.lastInsertRowid
  })

  after(async () => {
    await agent.del(`/users/${id}`)
  })

  it('should update user success', async() => {
    const res = await agent.put('/users/' + id)
    .send({
      fullname: 'test01-fullname-update',
      password: '1234-update',
      email: 'test01@email-update'
    })
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.data).to.be.equal('ok')

    const check = await agent.get(`/users/${id}`)
    const user = check.body
    expect(user.fullname).to.equal('test01-fullname-update')
    expect(user.email).to.equal('test01@email-update')


  }).timeout(3000)

})  