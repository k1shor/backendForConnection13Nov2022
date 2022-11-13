const Product = require('../Model/ProductModel')

exports.addProduct = async (req, res) => {
    let productToAdd = new Product({
        Product_name: req.body.product_name,
        Product_price: req.body.product_price,
        Product_description: req.body.product_description,
        Product_image: req.file.path,
        Category: req.body.category        
    })
    productToAdd = await productToAdd.save()
    if(!productToAdd){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(productToAdd)
}

exports.getAllProducts = async (req,res) => {
    let products = await Product.find().populate('Category','Category_name')
    if(!products){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(products)
}

// to get product details
exports.findProduct = async (req, res) => {
    let product = await Product.findById(req.params.product_id).populate('Category','Category_name')
    if(!product){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(product)
}

// update product
exports.updateProduct = async(req, res) => {
    let productToUpdate = await Product.findByIdAndUpdate(req.params.id, {
        Product_name: req.body.product_name,
        Product_price: req.body.product_price,
        Product_description: req.body.product_description,
        Product_image: req.file.path,
        Category: req.body.category,
        Rating: req.body.rating
    },{new:true})
    if(!productToUpdate){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(productToUpdate)
}

// delete product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(productToDelete=>{
        if(productToDelete==null){
            return res.status(400).json({error:"Product not found."})
        }
        else{
            return res.status(200).json({message:"Product deleted Successfully"})
        }
    })
    .catch(()=>{
        return res.status(400).json({error:"Something went wrong."})
    })
}

// to search products from category
exports.findProductByCategory = async(req, res) => {
    let products = await Product.find({
        Category : req.params.category_id
    })
    if(!products){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(products)

}