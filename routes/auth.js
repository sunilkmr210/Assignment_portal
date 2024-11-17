const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const {body, validationResult} = require('express-validator');

// provide username, password and isAdmin as body
router.post('/register', [
    body('username').isLength({min: 3}),
    body('password').isLength({min: 8}),
    body('isAdmin').isBoolean().withMessage('isActive must be a boolean value')

], async (req, res)=>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors); 
    }

    const newUser = new User({
        username: req.body.username,
        password: cryptoJs.AES.encrypt(req.body.password, process.env.cry_sec).toString(),
        isAdmin: req.body.isAdmin
    });

    try{
        const savedUser = await newUser.save();
        success = true;
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(500).json(err.message)
    }

})


//username and password as body
router.post('/login', async (req, res)=>{
    
    let success=false;

    try{
        const user1 = await User.findOne({username: req.body.username});
        if(!user1){
            res.status(404).json("user does not exists");
            return;
        }

        //decrypting encoded password
        const hashedPassword = cryptoJs.AES.decrypt(
            user1.password,
            process.env.cry_sec
        );
        const password1 = hashedPassword.toString(cryptoJs.enc.Utf8);

        if(password1 !== req.body.password){
            res.status(401).json("Incorrect password");
            return;
        }

        success = true;
        const accesstoken = jwt.sign({id: user1._id}, process.env.jwt_key);
        const {password, ...others} = user1._doc;
        res.status(200).json({...others, accesstoken});
    }
    catch(err){
        res.status(500).json(err.message);
    }
})

module.exports = router;