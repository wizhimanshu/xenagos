const express = require('express');
const router = express.Router();
let mockData = require('../mock-data');

// --- IMPORTANT: Paste both of your API Keys here ---
const PEXELS_API_KEY = 'ytGOWGmx87hiC3QWpBu91HyOI7UyecnjnSjnycz3DmLRytbQcsbCKOp9';
const GEOAPIFY_API_KEY = '74396f21c0f146c4b044cb5b6533a463';

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) { return res.redirect('/login'); }
    next();
};

// --- API Helper Functions ---
const fetchPexelsImages = async (query, perPage) => {
    // UPDATED: Make the query more specific for better results
    const refinedQuery = `travel ${query} landmark`;
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(refinedQuery)}&per_page=${perPage}`, {
        headers: { Authorization: PEXELS_API_KEY }
    });
    if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
    const data = await response.json();
    return data.photos;
};

const fetchLocationData = async (query) => {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&limit=1&apiKey=${GEOAPIFY_API_KEY}`);
    if (!response.ok) throw new Error(`Geoapify API error: ${response.status}`);
    const data = await response.json();
    return data.features[0];
};

// NEW: Helper function to fetch nearby hotels
const fetchNearbyHotels = async (lat, lon) => {
    const response = await fetch(`https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=5&apiKey=${GEOAPIFY_API_KEY}`);
    if (!response.ok) throw new Error(`Geoapify Places API error: ${response.status}`);
    const data = await response.json();
    return data.features.map(place => place.properties.name); // Return an array of hotel names
};

// GET / (Main Page)
router.get('/', async (req, res) => {
    // ... (This route remains the same as before, no changes needed here)
});

// POST /search - Now makes THREE parallel API calls
router.post('/search', isAuth, async (req, res) => {
    const locationName = req.body.location;
    if (!locationName) { return res.redirect('/'); }

    try {
        const locationResult = await fetchLocationData(locationName);
        if (!locationResult) { throw new Error('Location not found.'); }

        const lat = locationResult.properties.lat;
        const lon = locationResult.properties.lon;

        // --- Make API calls for images and hotels in parallel ---
        const [pexelsResult, hotelResult] = await Promise.all([
            fetchPexelsImages(locationName, 7), // Fetch 7 images (3 for slideshow, 4 for gallery)
            fetchNearbyHotels(lat, lon)
        ]);
        
        // --- Assemble the final data object ---
        const finalData = {
            name: locationResult.properties.formatted,
            coords: [lat, lon],
            coverImage: pexelsResult[0]?.src.large || '',
            // UPDATED: Sliced for 3 slideshow images + 4 gallery images
            slideshowImages: pexelsResult.slice(0, 3).map(p => p.src.large2x),
            apiImages: pexelsResult.slice(3, 7).map(p => p.src.large),
            // NEW: Add hotels to our data
            nearbyHotels: hotelResult,
            routesInfo: `Accessible by road, rail, and air. Check local travel providers for specific routes to ${locationResult.properties.city || locationResult.properties.name}.`,
            bookingLink: "https://www.redbus.in/",
            flightLink: "https://www.makemytrip.com/flights/",
            // UPDATED: Create a dynamic YouTube search link
            videoSearchLink: `https://www.youtube.com/results?search_query=travel+guide+${encodeURIComponent(locationResult.properties.city || locationResult.properties.name)}`
        };

        res.render('index', { 
            locationData: finalData, 
            underratedPlaces: mockData.underratedPlaces
        });

    } catch (error) {
        console.error("Search error:", error);
        res.render('index', {
            locationData: { error: `Could not find information for "${locationName}". Please try a different search.` },
            underratedPlaces: mockData.underratedPlaces
        });
    }
});

router.get('/journey', isAuth, (req, res) => { res.render('journey'); });

module.exports = router;