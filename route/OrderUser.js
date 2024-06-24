const { Router } = require('express');
const Order = require("../model/Orders");
const router = Router();

router.post('/orderdata', async (req, res) => {
    let data = req.body.order_data;
    data.splice(0, 0, { Order_date: req.body.order_date });
    let eId = await Order.findOne({ 'email': req.body.email });

    const { email } = req.body;
    
    if (eId === null) {
        try {
            await Order.create({
                email: email,
                order_data: [data]
            });
            res.status(200).json({ ok: true, message: "Order created successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ ok: false, message: "Server Error" });
        }
    } else {
        try {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.status(200).json({ success: true, message: "Order updated successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ ok: false, message: "Server Error" });
        }
    }
});


router.get('/myorder', async (req, res) => {
    try {
        const email = localStorage.getItem("email");
        const orders = await Order.find({email}).sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;


module.exports = router;

