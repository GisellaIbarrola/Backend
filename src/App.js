const express = require('express')
const cartsRouter = require('./routes/carts.router')
const productRouter = require('./routes/products.Router')

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true}))

server.use('/api/products', productRouter)
server.use('/api/carts', cartsRouter)


server.listen(8080, () => { 
  console.log("Inicio")
})