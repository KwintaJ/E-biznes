require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// --- rejestracja ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email i hasło są wymagane.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Użytkownik o takim adresie e-mail już istnieje.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie!', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Wystąpił błąd serwera podczas rejestracji.' });
  }
});

// --- logowanie ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email i hasło są wymagane.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Zalogowano.',
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Wystąpił błąd serwera podczas logowania.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie http://localhost:${PORT}`);
});

// --- logowanie OAuth2 Google: redirect to Google ---
app.get('/api/auth/google', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
});

// --- logowanie OAuth2 Google: callback from Google ---
app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Brak kodu autoryzacyjnego.');
  }

  try {
    // google token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    const googleAccessToken = tokenData.access_token;

    // user data
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    const googleUser = await userResponse.json();

    // data + token to prisma
    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        googleId: googleUser.id,
        googleToken: googleAccessToken,
      },
      create: {
        email: googleUser.email,
        googleId: googleUser.id,
        googleToken: googleAccessToken,
      },
    });

    // jwt token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&email=${user.email}`);

  } catch (error) {
    console.error('Błąd podczas logowania Google:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
  }
});

// --- logowanie OAuth2 GitHub: redirect to GitHub ---
app.get('/api/auth/github', (req, res) => {
  const rootUrl = 'https://github.com/login/oauth/authorize';
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    scope: 'user:email',
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
});

// --- logowanie OAuth2 GitHub: callback from GitHub ---
app.get('/api/auth/github/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Brak kodu autoryzacyjnego z GitHub.');
  }

  try {
    // github token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();
    const githubAccessToken = tokenData.access_token;

    if (!githubAccessToken) {
      throw new Error('Nie udało się uzyskać access_token z GitHub');
    }

    // user data
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubAccessToken}`,
        'User-Agent': 'GymApp-NodeJS-Server'
      }
    });
    const githubUser = await userResponse.json();

    // find email
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${githubAccessToken}`,
          'User-Agent': 'GymApp-NodeJS-Server'
        }
      });
      const emails = await emailsResponse.json();
      const primaryEmailObj = emails.find(e => e.primary && e.verified) || emails[0];
      email = primaryEmailObj ? primaryEmailObj.email : null;
    }

    if (!email) {
      return res.status(400).send('Nie udało się pobrać adresu email z profilu GitHub.');
    }

    // user to prisma
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        githubId: String(githubUser.id),
        githubToken: githubAccessToken,
      },
      create: {
        email: email,
        githubId: String(githubUser.id),
        githubToken: githubAccessToken,
      },
    });

    // jwt token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'tymczasowy_sekret',
      { expiresIn: '1h' }
    );

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&email=${user.email}`);

  } catch (error) {
    console.error('Błąd podczas logowania GitHub:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
  }
});