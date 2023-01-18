const fs = require ('fs')

class ProductManager{
constructor(path) {
  this.products = []
  this.path = path
}

#checkIfFileExists (){
  //Check if file exists
  return fs.existsSync(this.path)
}

addProduct = async ({title, description, price, status = true, category, code, stock}) => {
  //Validate NON empty input values
  if (title && description && price && category && code && stock){
    const id = this.products.length + 1
    const thumbnail = ''
      //Validate if file already exists
      const fileExists = this.#checkIfFileExists(this.path)
      if(!fileExists){
        //Create file
        await fs.promises.writeFile(this.path, JSON.stringify([{
          id,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail
        }]))
      }else{
        //Read file and append new data
        const fileExistingData = await this.getProducts(this.path)
        //Validate NON repeated code value
        const codeAlreadyExists = fileExistingData.find( (product) => product.code == code)
        if(!codeAlreadyExists){
          const id = fileExistingData.length + 1
          await fs.promises.writeFile(this.path, JSON.stringify([...fileExistingData, {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
          }]))
        }else{
        new Error(`The code ${code} already exists`)
        }
}
}else{
new Error(`Faltó ingresar algún valor`)
}
}


getProducts = async () => {
  const fileExists = this.#checkIfFileExists(this.path)
  if(fileExists){
    //Read file and return data
    const fileExistingData = await fs.promises.readFile(this.path, {encoding : 'utf-8'})
    const fileDataParsed = JSON.parse(fileExistingData)
    return fileDataParsed
  }else{
    //If file doesn´t exists return empty array
    return []
  }
}

getProductById = async (id) => {
  const products = await this.getProducts(this.path)
  const idToSearch = id - 1
  try {
    return products[idToSearch]
  } catch (error) {
    new Error ('Product not found')
  }
}

#getPositionOfArrayValue = async (id) => {
  //Check if ID exists
  const productFound = await this.getProductById(id)
  //As when creating a product, the ID will be the lenght + 1, now the ID to replace/delete should be the input - 1
  const positionFromArray = id - 1
  return positionFromArray
}
updateProduct = async (id, newProduct) =>{
  const products = await this.getProducts()
  const positionToReplace = await this.#getPositionOfArrayValue(id)
  newProduct.id = positionToReplace + 1
  products.splice(positionToReplace, 1, newProduct)
  await fs.promises.writeFile(this.path, JSON.stringify([...products]))
}

deleteProduct = async (id) => {
  const products = await this.getProducts()
  const positionToDelete = await this.#getPositionOfArrayValue(id)
  products.splice(positionToDelete, 1)
  await fs.promises.writeFile(this.path, JSON.stringify([...products]))
}

}

module.exports = ProductManager