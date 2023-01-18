const Router = require ('express')
const ProductManager = require('../utils/productManager')
const cartManager = require ('../utils/cartsManager')

const router = Router ()
const path = './../Files/Products.json' //ponerle dirname
const productManager = new ProductManager(path)

router.post('/', async (req, res) => {
  const resp = await cartManager.addCart()
  res.json( { msg : "Cart created", id: resp } )
})

//Cart By ID
router.get('/:cid', async (req, res) => {
  const cid = req.params.cid
  try {
    const cartFound = await cartManager.getCartByID(cid)
    res.send(cartFound)
  } catch (error) {
    res.status(404).json({ 
      msg: "Cart Not found", 
      error: error.message
    })
  }
})


//Add Product to Cart ID
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const productFound = await productManager.getProductById(pid)
    await cartManager.addProductToCart(cid, productFound.id)
    res.json({
      msg: `Product Id ${pid} successfully added to cart ID ${cid}`
    })
  } catch (error) {
    res.status(400).json({
      msg: "Failed to add Product to Cart",
      error: error.message
    })
  }
})

module.exports = router