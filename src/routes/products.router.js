const Router = require ('express')

const router = Router ()
const ProductManager = require('../utils/productManager')

const path = '../Files/Products.json' //ponerle dirname
const productManager = new ProductManager(path)

//All products
router.get('/', async (req, res) => {
  try {
    //Check for limit value on query
    const limit = req.query.limit
    const allProducts = await productManager.getProducts()
    if(!limit){
      res.send(allProducts)
    }else{
      //Filter products by limit query value
      res.send(allProducts.slice(0,limit))
    }
  } catch (error) {
    res.status(404).json({
      msg: "Error getting products",
      error: error.message
    })
  }
})

//Product By ID
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid
    const productFound = await productManager.getProductById(pid)
    if(productFound){
      res.send(productFound)
    }
  } catch (error) {
    res.status(404).json({
      msg: `Error getting product ID ${pid}`,
      error: error.message
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const product = req.body
    await productManager.addProduct(product)
    res.json({
      msg: "Product added successfully"
    })
  } catch (error) {
    res.status(400).json({
      msg: "Error adding product",
      error: error.message
    })
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid
    const product = req.body
    await productManager.updateProduct(pid, product)
    res.json({
      msg: "Product updated successfully"
    })
  } catch (error) {
    res.status(400).json({
      msg: "Error updating product",
      error: error.message
    })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid
    await productManager.deleteProduct(pid)
    res.json({
      msg: "Product deleted successfully"
    })
  } catch (error) {
    res.status(400).json({
      msg: "Error deleting product",
      error: error.message
    })
  }

})

module.exports = router