const {check, validationResult} = require('express-validator')

exports.categoryValidation = [
    check('Category_name','Category name is required').notEmpty()
    .isLength({min:3}).withMessage("Category name must be at least 3 characters")
]

exports.productValidation = [
    check('product_name', 'Product name is required').notEmpty()
    .isLength({min:3}).withMessage(
        "Product name must be at least 3 characters"
    ),
    check('product_description','Product description is required').notEmpty()
    .isLength({min:30}).withMessage("Product description must be at least 30 characters"),
    check('product_price','Product price is required').notEmpty()
    .isNumeric().withMessage('Price must be number'),
    check('category','Category is required').notEmpty()
]

exports.userValidation = [
    check('username', "Username is required").notEmpty()
    .isLength({min:3}).withMessage("Username must be at least 3 characters"),
    check('email','Email is required').notEmpty()
    .isEmail().withMessage("Email format incorrect"),
    check('password',"Password is required").notEmpty()
    .matches(/[a-z]/).withMessage("Password must consist at least one lowercase alphabet")
    .matches(/[A-Z]/).withMessage("Password must consist at least one uppercase alphabet")
    .matches(/[0-9]/).withMessage("Password must consist at least one number")
    .matches(/[-_.!@#$//]/).withMessage("Password must consist at least one special character")
    .isLength({min:8}).withMessage("Password must be at least 8 characters")
    .isLength({max:30}).withMessage("Password must not be more than 30 characters")
]

exports.validation = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        // return res.status(400).json({error: errors.array().map(err=>err.msg)})
        return res.status(400).json({error: errors.array()[0].msg})
    }
}

