const express = require('express')
const authController = require('../Controllers/authController')

const router = express.Router()
// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', authController.register)
// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', authController.login)
router.post('/refresh-token', authController.reFreshToken)
module.exports = router
