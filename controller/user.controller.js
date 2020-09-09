
const bcrypt = require('bcryptjs');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../config/keys').secret;

/**
 * @route POST api/users/register
 * @description Register the User
 * @access Public
**/


exports.login = function (req, res) {
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
                            token: `Bearer ${token}`,
                            msg: "Hurry! You are loged in."
                        })
                    })
                } else {
                    return res.status(400).json({
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
}


/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
// exports.profile = ('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
//     return res.json({
//         user: req.body.name
//     });
// });