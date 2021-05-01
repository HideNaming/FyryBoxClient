import express from 'express'
const app = express()

app.get('/user', (req, res) => {
  res.json({ user: req.user })
})

// -- export app --
export default {
  path: '/api/auth',
  handler: app
}