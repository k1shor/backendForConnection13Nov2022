const express = require('express')
const { placeOrder, viewOrders, viewOrderByUser, orderDetails, updateOrder, deleteOrder } = require('../controller/OrderController')
const router = express.Router()

router.post('/placeorder', placeOrder)
router.get('/orders', viewOrders)
router.get('/userorder/:userId', viewOrderByUser)
router.get('/order/:id', orderDetails)
router.put('/updateorder/:id',updateOrder)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router