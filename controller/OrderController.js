const Order = require('../Model/OrderModel')
const OrderItems = require('../Model/OrderItems')

// place order
exports.placeOrder = async(req,res) => {
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (orderItem)=>{
            let new_orderItem = new OrderItems({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            new_orderItem = await new_orderItem.save()
            {
                if(!new_orderItem){
                    return res.status(400).json({error:"Something went wrong"})
                }
            }
            return new_orderItem._id
        })
    )

    let individual_prices = await Promise.all(
        orderItemsIds.map(async (orderItem)=> {
            let order = await OrderItems.findById(orderItem).populate('product','Product_price')
            let individual_price = order.quantity * order.product.Product_price
            return individual_price
        })
    )
    let total_price = individual_prices.reduce((acc,cur)=>acc+cur)

    let order = new Order({
        orderItems: orderItemsIds,
        totalPrice: total_price,
        user: req.body.user,
        shippingAddress: req.body.shippingAddress,
        alternateShippingAddress: req.body.alternateShippingAddress,
        city: req.body.city,
        country: req.body.country,
        zipcode: req.body.zipcode,
        phone: req.body.phone
    })

    order = await order.save()

    if(!order){
        return res.status(400).json({error: "Failed to place order."})
    }
    res.send(order)

}

// view orders
exports.viewOrders = async (req,res) => {
    let orders = await Order.find().populate('user')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: { path: 'Category' } } })
    if(!orders){
        return res.status(400).json({error: "Something went wrong."})
    }
    res.send(orders)
}

// view orders of a user
exports.viewOrderByUser = async(req, res) => {
    let orders = await Order.find({user: req.params.userId}).populate({ path: 'orderItems', populate: { path: 'product', populate: { path: 'Category' } } })
    if(!orders){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(orders)
}

// view order details
exports.orderDetails = async (req, res) => {
    // let order = await Order.findOne({_id: req.params.id})
    let order = await Order.findById(req.params.id)
    .populate({ path: 'orderItems', populate: { path: 'product', populate: { path: 'Category' } } })
    if(!order){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(order)
}

// update order status
exports.updateOrder = async(req,res) => {
    let order = await Order.findByIdAndUpdate(req.params.id,{status: req.body.status},{new:true})
    if(!order){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(order)
}

// deleteorder
exports.deleteOrder = (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .then(async order=> {
        if(order){
            await order.orderItems.map(async orderItem=> {
                await OrderItems.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({message: "Order deleted successfully"})
        }
        return res.status(400).json({error:"Order not found"})
    })
    .catch(()=>{
        return res.status(400).json({error:"Something went wrong"})
    })
}