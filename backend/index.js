import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';


const app = express();
const PORT = 5000;
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Your React app URL
  credentials: true                 // Allow sending cookies
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//PostgreSQL connection
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log('PostgreSQL connected...');
});

// Setup session management

app.use(session({
  secret: process.env.SESSION_SECRET, // Change this for production
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true, // Protects against XSS attacks
      secure: false,  // Set to true only for HTTPS
      maxAge: 1000 * 60 * 60, // Session duration, e.g., 1 hour
  }
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Passport Facebook strategy
passport.use(new FacebookStrategy({
  clientID: 'FACEBOOK_APP_ID',
  clientSecret: 'FACEBOOK_APP_SECRET',
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  const { id, emails } = profile;
  const email = emails[0].value;

  try {
    let user = await db.query('SELECT * FROM users WHERE facebook_id = $1 OR email = $2', [id, email]);
    if (!user.rows.length) {
      // Create a new user if not found
      const newUser = await db.query('INSERT INTO users (email, facebook_id) VALUES ($1, $2) RETURNING *', [email, id]);
      return done(null, newUser.rows[0]);
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

// Passport Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const { id, emails } = profile;
  const email = emails[0].value;

  try {
    let user = await db.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [id, email]);
    if (!user.rows.length) {
      // Create a new user if not found
      const newUser = await db.query('INSERT INTO users (email, google_id) VALUES ($1, $2) RETURNING *', [email, id]);
      return done(null, newUser.rows[0]);
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

// Passport session setup
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Routes for local login
app.post('/login', passport.authenticate('local'), (req, res) => {
  
  res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/signup',  async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'User creation failed' });
  }
});
app.post('/create', async (req, res) => {
const userId = req.user.id; //this is only available when header has withCredentials set to true.
const {listName} = req.body;
try{
const listData = await db.query('INSERT INTO todo_lists (list_name, user_id) VALUES ($1, $2) RETURNING *', [listName, userId]);
//console.log(listData.rows[0].list_name); //return object and has property rows which has all rows in array and latest one is at index 0.
res.status(200).json({message: 'Data inserted successfully'});
} catch (err){
console.log(err);
}
});
app.get('/lists', async ( req, res) => {
  try{
  const userID = req.user.id;
  const query = 'SELECT list_name FROM todo_lists WHERE user_id = $1';
  const result = await db.query(query, [userID]);
  const lists = result.rows.map(row => row.list_name); //because we get array of { list_name: 'hi' }
  console.log(lists); 
  res.status(200).json(lists);
  } catch (err){
    console.error('Error fetching tasks', err);
  }
});



// Facebook login routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('http://localhost:3000/dashboard');
}
);

// Google login routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
  }), (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);
//check session
app.get('/api/session-check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user }); // Return the user data and isAuthenticated flag
  } else {
    res.status(401).json({ isAuthenticated: false, message: 'Not authenticated' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
