const User = require('../models/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

let refreshTokens = []
const reFreshToken = (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data)
    if (err) res.sendStatus(403)
    const accessToken = jwt.sign({ userId: data.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    })
    res.json({ accessToken })
  })
}

const register = async (req, res) => {
  const { username, email, password } = req.body
  //Simple validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username and/or password' })
  }
  try {
    //check for exitsting user
    const user = await User.findOne({ username: username })
    if (user) {
      return res.status(400).json({ success: false, message: 'Username already exists' })
    }

    const emailUser = await User.findOne({ email: email })
    if (emailUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    //OK
    const hashPassword = await argon2.hash(password)
    const newUser = new User({ username, email, password: hashPassword })
    await newUser.save()
    //Return token
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
    res.json({
      success: true,
      message: 'User created successfully',
      accessToken,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
const login = async (req, res) => {
  const { username, password } = req.body
  //Simple validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username and/or password' })
  }
  try {
    //check for exitsting user
    const user = await User.findOne({ username: username })

    if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrect username or password' })
    }
    //username found
    const passwordValid = await argon2.verify(user.password, password)
    if (!passwordValid) {
      return res.status(400).json({ success: false, message: 'Incorrect username or password' })
    }
    // Create JWT
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    })
    //Refresh JWT
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    // Return token
    res.json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
  console.log(refreshTokens)
}

module.exports = {
  register,
  login,
  reFreshToken,
}
