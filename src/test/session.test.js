const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Tests de session', () => {
  let cookie;
  const mockUser = {
    firstName: 'Gisella',
    lastName: 'Ibarrola',
    email: 'gisemail@gmail.com',
    password: '123456789',
    age: '26',
    role: "premium" 
  }
  let loginUser;

  it('Registrar a un usuario', async () => {

    const {
      statusCode,
    } = await requester.post('/api/sessions/register').send(mockUser)

    expect(statusCode).to.be.equal(200)
  })

  it('Login the usuario y validar que devuelva una cookie', async () => {
    loginUser = {
      email: mockUser.email,
      password: mockUser.password
    }

    const result = await requester.post('/api/sessions/login').send(loginUser)
    const cookieResponse = result.headers['set-cookie'][0]
    expect(cookieResponse).to.be.ok
    cookie = {
      name: cookieResponse.split('=')[0],
      value: cookieResponse.split('=')[1]
    }

    expect(cookie.name).to.be.ok.and.eql('cookie-user')
    expect(cookie.value).to.be.ok
  })

  it('Buscar el usuario "current" por cookie y ver que sea el correcto', async () => {
    const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

    expect(_body.user.email).to.be.equal(mockUser.email)
  })
})