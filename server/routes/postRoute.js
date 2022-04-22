const express = require('express')
const postController = require('../Controllers/postController')
const router = express.Router()
const verifyToken = require('../middleware/auth')

// @route POST api/posts
// @desc Create post
// @access Private
router.get('/', verifyToken, postController.getPosts)
router.post('/', verifyToken, postController.createƯPost)
module.exports = router
