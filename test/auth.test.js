import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import Config from './config.test'

chai.use(chaiHttp)
chai.should()

const agent = chai.request.agent(`${Config.HOST}`)

describe('# POST /auth/login', () => {
  afterEach(async () => {
    await agent.post('/auth/logout')
  })

  it('should login success', async () => {
    const res = await agent.post('/auth/login')
      .send(Config.userCredentials)
    expect(res).to.have.status(200)
    expect(res.body.data).to.be.equal('ok')

  }).timeout(3000)

  it('should login fail for error user credentials', async () => {
    const res = await agent.post('/auth/login')
      .send(Config.errorUserCredentials)
    expect(res).to.have.status(401)
    expect(res.body.message).to.be.equal('Authentication error')

  }).timeout(3000)

  it('should switch page fail not login', async () => {
    const res = await agent.get('/users')
    expect(res).to.have.status(401)
    expect(res.body.message).to.be.equal('Authentication error')

  }).timeout(3000)

})

describe('# POST /auth/passwd', () => {
  before(done => {
    agent
      .post('/auth/login')
      .send(Config.userCredentials)
      .end(done)
  })

  it('should change password success', async () => {
    const res = await agent.post('/auth/passwd')
      .send({original: '1234', password: '5678'})
    expect(res).to.have.status(200)
    expect(res.body.data).to.be.equal('ok')

    await agent.post('/auth/passwd')
      .send({original: '5678', password: '1234'})

  }).timeout(3000)

  it('should change password fail for original password input error', async () => {

    const res = await agent.post('/auth/passwd')
      .send({original: 'error password', password: '5678'})
    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('wrong original password')

  }).timeout(3000)

  it('should change password fail for not input original', async () => {
    const res = await agent.post('/auth/passwd')
      .send({password: '1234'})
    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('original required')

  }).timeout(3000)

})

describe('# POST /auth/logout', () => {
  it('should logout success', async () => {
    const res = await agent.post('/auth/logout')
    expect(res).to.have.status(200)
    expect(res.body.data).to.be.equal('ok')

  }).timeout(3000)
})