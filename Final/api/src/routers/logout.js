const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })

router.use(cookieParser());
router.use(express.json());

const { removeToken } = require('../middleware/TokenMiddleware');

//Logout
router.post('/', (req,  res) => {
  removeToken(req, res);
  res.json({message: `Goodbye ${req.body.username}.`});
});

module.exports = router