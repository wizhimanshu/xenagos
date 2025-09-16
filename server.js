const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs'); // NEW: Import the File System module

const app = express();
const PORT = process.env.PORT || 3000;

// --- NEW: Persistent User "Database" ---
const USERS_DB_PATH = path.join(__dirname, 'users.json');
let users = [];

try {
    // Read users from the JSON file on startup
    const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
    users = JSON.parse(data);
    console.log('Successfully loaded user data from users.json');
} catch (error) {
    console.log('Could not read users.json, starting with an empty user list.');
    // If file doesn't exist or is empty, users will remain []
}

// Make the users array and bcrypt accessible to our routes
app.locals.users = users;
app.locals.bcrypt = bcrypt;

// --- Middleware ---
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'a-very-strong-secret-key-for-sih',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});

// --- Routes ---
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

app.use(authRoutes);
app.use(indexRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});