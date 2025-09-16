const express = require('express');
const router = express.Router();
const fs = require('fs'); // NEW: Import the File System module
const path = require('path'); // NEW: Import the Path module

// Define the path to the users database file
const USERS_DB_PATH = path.join(__dirname, '..', 'users.json');

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

    if (users.find(user => user.username === username)) {
        return res.render('signup', { error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };
    
    // Add the new user to the in-memory array
    users.push(newUser);

    // --- NEW: Save the updated array back to the file ---
    try {
        // Use JSON.stringify with formatting for readability
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
        console.log('New user saved to users.json');
    } catch (error) {
        console.error('Failed to save user to users.json:', error);
        // Handle error (e.g., render an error page)
        return res.render('signup', { error: 'Could not create account. Please try again.' });
    }
    
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
        if (err) { return res.redirect('/'); }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;