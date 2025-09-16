const express = require('express');
const router = express.Router();
const mockData = require('../mock-data');

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};

// GET / (Main Page)
router.get('/', (req, res) => {
    res.render('index', { 
        locationData: null, 
        underratedPlaces: mockData.underratedPlaces 
    });
});

// POST /search
router.post('/search', isAuth, (req, res) => {
    const locationName = req.body.location.toLowerCase().trim();
    const data = mockData.locations[locationName];

    if (data) {
        res.render('index', { 
            locationData: data, 
            underratedPlaces: mockData.underratedPlaces
        });
    } else {
        res.render('index', {
            locationData: { error: `Sorry, we don't have information for "${locationName}".` },
            underratedPlaces: mockData.underratedPlaces
        });
    }
});

// GET /journey
router.get('/journey', isAuth, (req, res) => {
    res.render('journey'); 
});

module.exports = router;