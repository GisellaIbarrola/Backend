const chai = require('chai')
const supertest = require('supertest')
const { generateProduct } = require('../utils/faker')

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test de productos', () => {
  it('Buscar producto por ID', async () => {
    const pid = '63f5748c7b20b0b0675f165d'
    const {
      _body
    } = await requester.get(`api/products/${pid}`)

    expect(_body.payload.title).to.be.equal('Coca Cola Original 1.75 lts')
  })

  it('Crear un producto nuevo', async () => {

    const mockOwner = '641a51f4d77b94167bec5b78'
    const mockProduct = generateProduct()
    const { description } = mockProduct
    mockProduct.owner = mockOwner
    const {
      statusCode,
      _body
    } = await requester.post('/api/products').send(mockProduct)

    expect(statusCode).to.be.ok
    expect(_body.payload.description).to.be.equal(description)

  })

  it('Actualizar el precio de un producto por ID', async () => {
    const pid = '63f5748c7b20b0b0675f165d'

    const {
      _body
    } = await requester.get(`/api/products/${pid}`)
  
    const product = _body.payload
    const newPrice = 5000
    product.price = newPrice

    const putRequest = await requester.put(`/api/products/${pid}`).send(product)


    const productUpdated = await requester.get(`/api/products/${pid}`)
    expect(productUpdated._body.payload.price).to.be.equal(newPrice)
  })
})
