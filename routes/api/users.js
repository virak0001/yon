const express = require('express');
const router = express.Router();
const User = require('../../model/user.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const key = require('../../config/keys').secret;

/**
 * @route GET api/users
 * @description Get the User
 * @access Public
**/
router.get('/api/users',passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.json({
        user: req.user
    });
});


/**
 * @route POST api/users/register
 * @description Register the User
 * @access Public
**/
router.post('/api/users',(req,res)=>{
    let {
        name,
        email,
        password,
        confirm_password,
        date
    } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            msg: "Password do not match."
        })
    }
    User.findOne({email: email}).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Email is already register. Did you forgot you password."
            });
        } else {
            // The data is valid and new we can register the user 
            let newUser = new User({
                name,
                email,
                password
            });
            // Hash the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    try {
                        newUser.password = hash;
                        newUser.save().then(user => {
                            return res.status(201).json({
                                success: true,
                                msg: "Hurry! User is now register."
                            })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                })
            })
        }
    }).catch((err) => {
        console.log(err)
    });
});

/**
 * @route POST api/users/
 * @desc Return the user authetication
 * @access Public
 */
router.post('/api/users/login', (req,res)=>{
    User.findOne({ email: req.body.email }).then(user => {
        try {
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }
                    jwt.sign(payload, key, {
                        expiresIn: 360
                    }, (err, token) => {
                        res.status(200).json({
                            success: true,
                            user:user,
                            token: `Bearer  ${token}`,
                            msg: "Hurry! You are loged in."
                        })
                    })
                } else {
                    return res.status(422).json({
                        msg: "Incorrect password!",
                        success: false
                        ,
                    })
                }
            })
        } catch (error) {
            return res.status(400).json({
                msg: "Email is not found.",
                success: false
            })
        }
    })
})

/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
router.get('/api/users/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.json({
        user: req.user
    });
});

module.exports = router;
