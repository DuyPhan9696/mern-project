const Post = require('../models/Posts')
const User = require('../models/User')
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).populate('userId', ['username'])
    res.json({ success: true, posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const createƯPost = async (req, res) => {
  const { title, decription, url, status } = req.body
  //Simple validation
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' })
  }
  try {
    const newPost = new Post({
      title,
      decription,
      url: url.startsWith('http://') ? url : `http://${url}`,
      status: status || 'TO LEARN',
      userId: req.userId,
    })
    await newPost.save()
    res.json({ success: true, message: 'Good luck!', post: newPost })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
module.exports = {
  getPosts,
  createƯPost,
}
