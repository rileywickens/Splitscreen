const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })
const UserDAO = require('../db/UserDAO');

router.use(cookieParser());
router.use(express.json());
const { generateToken } = require('../middleware/TokenMiddleware');

//Register
router.post('/', async (req,  res) => {
    console.log("HERE");
    const {firstname, lastname, username, password} = req.body;
    if (firstname && lastname && username && password) {
        UserDAO.createNewUser(username, password, firstname, lastname)
        .then(user => {
            generateToken(req, res, user);
            return res.json({user: user});
        }).catch((err) => {
            console.log(err)
            return res.status(err.code || 500).json({error: err.message});
        });
    } else {
        console.log("Error: Required user info missing");
        return res.status(400).json({error: 'Required user information missing'})
    }
});

module.exports = router