const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const jwt = require("jsonwebtoken");
const JWt_SECURE = 'This is my angle';

// Router-1
// Use this link for the GET request (http://localhost:7000/api/auth/createuser)
router.post('/createuser', [
    body('name', 'Invalid UserName').isLength({ min: 3 }),
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
try {
    // Check if the user with the given email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ email: "This email is already in use" });
    }

    const salt =  bcrypt.genSaltSync(10);
    const securePassword =  bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
    });
    const data = {
      user:{
        id:user.id
      }       
    }
    const authtoken = jwt.sign(data, JWt_SECURE);
    res.json({authtoken});
} catch (error) {
    console.error(error.message);
    res.status(500).json({error: "Internal server error"});
}
});

// Router-2
// Use this link for the GET request (http://localhost:7000/api/auth/loginuser)
router.post('/loginuser', [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password should not be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ email: "Please login with the right credentials" });
        }
        const passwordChecker = await bcrypt.compare(password, user.password);
        console.log(passwordChecker);
        if (!passwordChecker) {
            return res.status(400).json({ password: "Please login with the right credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWt_SECURE);
        res.json({ authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Router-3
// Use this link for the GET request (http://localhost:7000/api/auth/getuser)
router.post('/getuser', fetchuser, async (req,res)=>{
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Internal servar error');
    }
 
})

module.exports = router;
