const express = require('express');
const router = express.Router();
const mockData = require('../mock-data'); // We'll create this file

// Middleware to protect routes that require login
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};

// GET / (Main Page)
router.get('/', isAuth, (req, res) => {
    // Render the page without location data initially
    res.render('index', { locationData: null });
});

// POST /search
router.post('/search', isAuth, (req, res) => {
    const locationName = req.body.location.toLowerCase().trim();
    const data = mockData[locationName];

    if (data) {
        res.render('index', { locationData: data });
    } else {
        res.render('index', {
            locationData: { error: `Sorry, we don't have information for "${locationName}". Please try 'Goa' or 'Delhi'.` }
        });
    }
});

module.exports = router;