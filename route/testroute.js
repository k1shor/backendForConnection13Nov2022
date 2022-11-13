// import express
const express = require('express')
const { testfunction } = require('../controller/testcontroller')
const router = express.Router() // import router from express

router.get('/routetest', (req,res)=>{
    res.send("This is a test message from router.")
})
router.get('/controllertest', testfunction)



// export router
module.exports = router