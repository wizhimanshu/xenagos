const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const USERS_DB_PATH = path.join(__dirname, '..', 'users.json');

const isLoggedOut = (req, res, next) => {
    if (req.session.isLoggedIn) { return res.redirect('/'); }
    next();
};

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) { return res.redirect('/login'); }
    next();
};

// --- Standard Login & Signup Routes ---
router.get('/login', isLoggedOut, (req, res) => { res.render('login', { error: null }); });
router.get('/signup', isLoggedOut, (req, res) => { res.render('signup', { error: null }); });

router.post('/signup', async (req, res) => {
    const { username, password, mobile } = req.body;
    const users = req.app.locals.users;
    const bcrypt = req.app.locals.bcrypt;

    if (users.find(user => user.username === username)) {
        return res.render('signup', { error: 'Username already exists.' });
    }
    if (!/^\d{10}$/.test(mobile)) { // Simple 10-digit validation
        return res.render('signup', { error: 'Please enter a valid 10-digit mobile number.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
        id: Date.now().toString(), 
        username, 
        password: hashedPassword, 
        mobile,
        socials: { twitter: '', linkedin: '' } // Initialize social links
    };
    
    users.push(newUser);

    try {
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
        console.log('New user saved to users.json');
    } catch (error) {
        console.error('Failed to save user:', error);
        return res.render('signup', { error: 'Could not create account. Please try again.' });
    }
    
    res.redirect('/login');
});

// --- NEW: 2-Step Verification Flow ---

// Step 1: User submits username/password
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
        // Correct password, now set up for OTP verification
        const fakeOtp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        req.session.otp = fakeOtp;
        req.session.userIdToVerify = user.id;
        console.log(`Generated OTP for ${user.username} (${user.mobile}): ${fakeOtp}`);
        
        // Redirect to the OTP entry page
        return res.redirect(`/verify-otp?m=${user.mobile.slice(-4)}`);
    } else {
        return res.render('login', { error: 'Invalid username or password.' });
    }
});

// Step 2: Show the OTP entry page
router.get('/verify-otp', isLoggedOut, (req, res) => {
    if (!req.session.userIdToVerify) {
        return res.redirect('/login');
    }
    // For the demo, we'll pass the OTP to the page so it can be displayed
    res.render('verify-otp', { error: null, mobileLast4: req.query.m, fakeOtp: req.session.otp });
});

// Step 3: User submits the OTP
router.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    const users = req.app.locals.users;
    
    if (req.session.otp && otp == req.session.otp) {
        // OTP is correct, complete the login
        const user = users.find(u => u.id === req.session.userIdToVerify);
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id, username: user.username, mobile: user.mobile };

        // Clean up temporary session data
        delete req.session.otp;
        delete req.session.userIdToVerify;

        return res.redirect('/');
    } else {
        // Incorrect OTP
        res.render('verify-otp', { error: 'Invalid OTP. Please try again.', mobileLast4: req.query.m, fakeOtp: req.session.otp });
    }
});


// --- NEW: User Profile Routes ---
router.get('/my-details', isAuth, (req, res) => {
    const users = req.app.locals.users;
    const currentUser = users.find(u => u.id === req.session.user.id);
    res.render('my-details', { user: currentUser });
});

router.post('/update-details', isAuth, (req, res) => {
    const { twitter, linkedin } = req.body;
    const users = req.app.locals.users;
    
    const userIndex = users.findIndex(u => u.id === req.session.user.id);
    if (userIndex !== -1) {
        users[userIndex].socials = { twitter, linkedin };
        try {
            fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
            console.log('User details updated in users.json');
        } catch (error) {
            console.error('Failed to update user details:', error);
        }
    }
    res.redirect('/my-details');
});


// --- Logout Route ---
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) { return res.redirect('/'); }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;