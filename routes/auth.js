const express = require('express');
const router = express.Router();

// Middleware to prevent logged-in users from accessing login/signup pages
const isLoggedOut = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
};

// GET /login
router.get('/login', isLoggedOut, (req, res) => {
    res.render('login', { error: null });
});

// GET /signup
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('signup', { error: null });
});

// POST /signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const users = req.app.locals.users;
    const bcrypt = req.app.locals.bcrypt;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.render('signup', { error: 'Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ id: Date.now().toString(), username, password: hashedPassword });
    
    console.log('New user signed up:', users[users.length - 1]); // For debugging
    res.redirect('/login');
});

// POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = req.app.locals.users;
    const bcrypt = req.app.locals.bcrypt;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.render('login', { error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id, username: user.username };
        return res.redirect('/');
    } else {
        return res.render('login', { error: 'Invalid username or password.' });
    }
});

// GET /logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.redirect('/login');
    });
});

module.exports = router;