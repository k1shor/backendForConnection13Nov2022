const Category = require('../Model/CategoryModel')

exports.addCategory = async (request, response) => {
    let category = await Category.findOne({
        Category_name : request.body.Category_name
    })
        if(!category){
            let categoryToAdd = new Category({
                Category_name: request.body.Category_name
            })
            categoryToAdd = await categoryToAdd.save()
            if(!categoryToAdd){
                // response.send("Failed to create category")
        return response.status(400).json({error: "Failed to create category"})

            }
            else{
                response.send(categoryToAdd)
            }
        }
        else{
            // response.send("Category already exists.")
        return response.status(400).json({error: "Category already exists"})
        }
    }


// to get all the categories
exports.getAllCategories = async (req, res) => {
    let category = await Category.find()
    if(!category){
        // res.send("Category not found")
        return res.status(400).json({error: "Category not found"})
    }
    else{
        res.send(category)
    }
}

// to find particular category
exports.findCategory = async (req, res) => {
    let category = await Category.findById(req.params.id)
    if(!category){
        // res.send("Category not found")
        return res.status(400).json({error: "Category not found"})
    }
    else{
        res.send(category)
    }
}

// edit category
exports.updateCategory = async (req, res) => {
    let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id, {
        Category_name : req.body.Category_name
    },{new:true})
    if(!categoryToUpdate){
        // res.send("Failed to update category")
        return res.status(400).json({error: "Failed to update category"})

    }
    else{
        res.send(categoryToUpdate)
    }
}

// to delete category
// exports.deleteCategory = async (req, res) => {
//     let category = await Category.findByIdAndRemove(req.params.id)
//     if(!category){
//         // res.send("Category does not exist")
//         return res.status(400).json({error: "Category does not exist"})
//     }
//     else{
//         // res.send("Category deleted successfully")
//         return res.status(200).json({msg: "Category deleted successfully"})
//     }
// }

// delete category using promise 
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(categoryToDelete=>{
        if(categoryToDelete==null){
            return res.status(400).json({error:"Category does not exist"})
        }
        return res.status(200).json({msg:"Category deleted successfully"})
    })
    .catch((e)=>{
        return res.status(400).json({error:e.message})
    })
}

// request.body.variablename -> input from form, variablename should match in form
// request.params.variablename -> input from url after '/', variablename should match in route
// request.query.variablename -> input from url after '?variablename='

// response.send(result) -> result may be string or object
// response.status(statuscode).json({key:value}) -> statuscode : 400 - error, 200 - success msg