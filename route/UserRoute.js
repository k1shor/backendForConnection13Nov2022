const express = require('express')
const { register, verifyEmail, userList, findUser, searchUserByEmail, resendconfirmation, signin, forgetPassword, resetPassword, signout } = require('../controller/UserController')
const { userValidation, validation } = require('../validator/validationSchema')
const router = express.Router()

router.post('/register',userValidation, validation,register)
router.get('/emailconfirmation/:token', verifyEmail)
router.get('/userlist',userList)
router.get('/finduser/:id',findUser)
router.get('/finduserbyemail',searchUserByEmail)
router.get('/resendconfirmation', resendconfirmation)
router.post('/signin', signin)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.get('/signout',signout)

module.exports = router