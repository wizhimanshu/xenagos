const express = require('express');
const path = require('path'); // CORRECTED LINE
const session = require('express-session');
const bcrypt = require('bcrypt');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// --- Temp Database ---
// In a real app, this would be in a database.
const users = [];
app.locals.users = users; // Make users accessible in routes
app.locals.bcrypt = bcrypt; // Make bcrypt accessible for hashing

// --- Middleware ---
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(session({
    secret: 'a-very-strong-secret-key-for-sih', // Replace with a real secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 } // 'secure: true' in production with HTTPS
}));

// --- Custom Middleware to make session available to all templates ---
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