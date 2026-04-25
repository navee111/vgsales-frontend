import express from 'express'
import cors from 'cors'
import session from 'express-session'
import axios from 'axios'
import dotenv from 'dotenv'
import process from 'node:process'
dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}))

app.get('/auth/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query
  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    })
    const { access_token } = tokenRes.data

    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const { email, name } = profileRes.data

    const API = process.env.WT1_API_URL
    const password = `${process.env.OAUTH_PASSWORD_SALT}${email}`
    let jwt

    try {
      const loginRes = await axios.post(API, {
        query: `mutation { login(email: "${email}", password: "${password}") { token } }`
      }, { headers: { 'Content-Type': 'application/json' } })
      jwt = loginRes.data.data?.login?.token
      if (!jwt) throw new Error('no token')
    } catch {
      const regRes = await axios.post(API, {
        query: `mutation { register(email: "${email}", name: "${name}", password: "${password}") { token } }`
      }, { headers: { 'Content-Type': 'application/json' } })
      jwt = regRes.data.data?.register?.token
    }

    req.session.jwt = jwt
    req.session.user = { name, email }

    res.redirect(process.env.FRONTEND_URL)
  } catch (err) {
    console.error(err)
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`)
  }
})

app.get('/auth/me', (req, res) => {
  if (!req.session.jwt) return res.status(401).json({ error: 'Not authenticated' })
  res.json({ user: req.session.user, token: req.session.jwt })
})

app.post('/auth/logout', (req, res) => {
  req.session.destroy()
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Auth server kör på port ${PORT}`))

