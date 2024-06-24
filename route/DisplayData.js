const { Router } = require('express');
const User = require("../model/user");

const router = Router();

router.post('/fooddata', (req, res) => {
    try {
                           
        res.send([global.food_items,global.food_category]);
    } catch (error) {
        console.log(error.message);
        res.send("Server Error");
    }
})

module.exports = router;