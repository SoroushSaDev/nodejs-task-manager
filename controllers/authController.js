const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate JWT access token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  )
}

// Generate refresh token (longer-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

// @desc    Register user
exports.register = async (req, res) => {
    const { name, email, password } = req.body
  
    try {
      const userExists = await User.findOne({ name })
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
      }
  
      const user = await User.create({
        name,
        email,
        password,
      })
  
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
  
      user.refreshToken = refreshToken
      await user.save()
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
  
      res.status(201).json({
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  

// @desc    Login user
exports.login = async (req, res) => {
  const { name, password } = req.body

  const user = await User.findOne({ name })
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  user.refreshToken = refreshToken
  await user.save()

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.json({ accessToken })
}

// @desc    Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== refreshToken) throw new Error()

    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken })
  } catch {
    res.sendStatus(403)
  }
}

// @desc    Logout user
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return res.sendStatus(204)

  const user = await User.findOne({ refreshToken })
  if (user) {
    user.refreshToken = null
    await user.save()
  }

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })
  res.sendStatus(204)
}
