const express = require('express')
const userController = require('../Controllers/userController')

const router = express.Router()
//update user
router.put('/:id', userController.updateUser)
module.exports = router
