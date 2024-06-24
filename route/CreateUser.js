const { Router } = require('express');
const User = require("../model/user");
const { body, validationResult } = require('express-validator');
const { createHmac, randomBytes } = require('crypto');
const jwt = require('jsonwebtoken')

const secret = "srijan";
const router = Router();

router.post('/createUser', 
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        const { name, email, password, location } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = randomBytes(16).toString('hex');
        const hash = createHmac('sha256', salt)
            .update(password)
            .digest('hex');

        try {
            await User.create({
                name,
                email,
                salt,
                password: hash,
                location
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }
);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const salt = user.salt;
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        if (user.password !== hash) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.cookie('authToken', token);

        res.json({ success: true, authToken: token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'what is this error' });
    }
});


module.exports = router;