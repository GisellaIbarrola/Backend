const chai = require('chai')
const supertest = require('supertest')
const Assert = require('assert')

const expect = chai.expect
const requester = supertest('http://localhost:8080')
const assert = Assert.strict

describe('Test de carrito', () => {
  it('Crear un nuevo carrito y ver que los productos se guarden en un array', async () => {
    const mockCart = {
      "products": ["63f5743e7b20b0b0675f165b", "63f5748c7b20b0b0675f165d", "63f5751e7b20b0b0675f165f", "63f5751e7b20b0b0675f165f", "63f5751e7b20b0b0675f165f"],
      "users": ["641a51f4d77b94167bec5b78"]
  }
    const {
      statusCode,
      _body
    } = await requester.post('/api/carts').send(mockCart)

    expect(statusCode).to.be.ok
    const payload = _body.payload
    expect(payload.cart.totalQuantity).to.be.equal(3)
    const products = payload.cart.products
    assert.strictEqual(Array.isArray(products), true)
  })

  it('Buscar carrito por ID', async () => {
    const cid = '64481dea258ecc3f76451a57'
    const {
      _body
    } = await requester.get(`/api/carts/${cid}`)

    expect(_body.payload).to.have.property('_id')
    expect(_body.payload._id).to.be.equal(cid)
  })

  it('Comprar un carrito', async () => {
    const cid = '644819057acba2750f9c2e60'

    const {
      _body
    } = await requester.get(`/api/carts/${cid}/purchase`)

    const payload = _body.payload
    expect(payload.msg).to.be.equal('Ticket creado')
    expect(payload.ticket).to.have.property('purchaser')
    
  })
})
