const express = require('express');
const router = express.Router();
let mockData = require('../mock-data');
const ncrbData = require('../ncrb-data'); // Import NCRB data

// --- Your API Keys ---
const PEXELS_API_KEY = 'ytGOWGmx87hiC3QWpBu91HyOI7UyecnjnSjnycz3DmLRytbQcsbCKOp9';
const GEOAPIFY_API_KEY = '74396f21c0f146c4b044cb5b6533a463';
const OPENWEATHER_API_KEY = 'c3afce02ec5a996499ed9573221f677e';
const NEWS_API_KEY = '90bdef5da1bd49159bbbf4b4d704ffe6'; // This will no longer be used but is kept for reference.
const GNEWS_API_KEY = '350459b43de9c67c5f2dff006b53221f'; // <-- IMPORTANT: Add your new GNews API key here.

// --- A hardcoded backup array for the Underrated Places section ---
const backupUnderratedPlaces = [
    {
        name: "Ziro Valley, Arunachal Pradesh",
        description: "A lush, green paradise known for its tranquil beauty and the vibrant Apatani culture.",
        image: "[https://images.unsplash.com/photo-1626932731704-5ded141443b7?q=80&w=600](https://images.unsplash.com/photo-1626932731704-5ded141443b7?q=80&w=600)"
    },
    {
        name: "Gokarna, Karnataka",
        description: "A serene coastal town offering pristine beaches and a more laid-back vibe than Goa.",
        image: "[https://images.unsplash.com/photo-1621689228722-6d45e146c241?q=80&w=600](https://images.unsplash.com/photo-1621689228722-6d45e146c241?q=80&w=600)"
    },
    {
        name: "Khajjiar, Himachal Pradesh",
        description: "Often called the 'Mini Switzerland of India', this meadow is a stunning natural retreat.",
        image: "[https://images.unsplash.com/photo-1625349424362-235884219933?q=80&w=600](https://images.unsplash.com/photo-1625349424362-235884219933?q=80&w=600)"
    }
];

// Middleware for authenticated routes
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) { return res.redirect('/login'); }
    next();
};

// --- API Helper Functions ---
const fetchPexelsImages = async (query, perPage) => {
    if (!PEXELS_API_KEY || PEXELS_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
        console.error("PEXELS API KEY is missing! Please add it to routes/index.js");
        return [];
    }
    try {
        const refinedQuery = `travel ${query} landmark`;
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(refinedQuery)}&per_page=${perPage}`, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error(`Failed to fetch images for "${query}":`, error);
        return [];
    }
};

const fetchLocationData = async (query) => {
    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === 'PASTE_YOUR_GEOAPIFY_API_KEY_HERE') {
        console.error("GEOAPIFY API KEY is missing! Please add it to routes/index.js");
        return null;
    }
    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&limit=1&apiKey=${GEOAPIFY_API_KEY}`);
        if (!response.ok) throw new Error(`Geoapify API error: ${response.status}`);
        const data = await response.json();
        return data.features[0];
    } catch(e) {
        console.error("Geoapify location fetch failed:", e);
        return null;
    }
};

const fetchNearbyHotels = async (lat, lon) => {
    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === 'PASTE_YOUR_GEOAPIFY_API_KEY_HERE') {
        return [];
    }
    try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=5&apiKey=${GEOAPIFY_API_KEY}`);
        if (!response.ok) throw new Error(`Geoapify Places API error: ${response.status}`);
        const data = await response.json();
        return data.features.map(place => place.properties.name);
    } catch (e) {
        console.error("Geoapify hotel fetch failed:", e);
        return [];
    }
};

const fetchNearbyPlaces = async (lat, lon, categories) => {
    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === 'PASTE_YOUR_GEOAPIFY_API_KEY_HERE') {
        console.error("GEOAPIFY API KEY is missing!");
        return [];
    }
    try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},10000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`);
        if (!response.ok) {
            console.error('Geoapify API URL that failed:', response.url);
            throw new Error(`Geoapify Places API error: ${response.status}`);
        }
        const data = await response.json();
        return data.features.map(place => ({
            name: place.properties.name || place.properties.address_line1,
            address: place.properties.formatted,
            lat: place.properties.lat,
            lon: place.properties.lon
        }));
    } catch (e) {
        console.error("Geoapify nearby places fetch failed:", e);
        return [];
    }
};


const fetchSafetyNews = async (location) => {
    // NEW IMPLEMENTATION USING GNEWS
    if (!GNEWS_API_KEY || GNEWS_API_KEY === 'YOUR_GNEWS_API_KEY') {
        console.error("GNEWS API KEY is missing! Please get a free key from gnews.io and add it to routes/index.js");
        return [];
    }
    try {
        // Use a simpler, more effective query with just the primary location name.
        const locationName = location.split(',')[0];
        const query = `"${locationName}" safety OR tourist OR crime`;
        
        const response = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=5&apikey=${GNEWS_API_KEY}`);
        
        if (!response.ok) throw new Error(`GNews API error: ${response.statusText}`);
        
        const data = await response.json();
        
        // GNews API returns articles in the 'articles' property.
        return data.articles.filter(article => article.title && article.description);
        
    } catch (error) {
        console.error(`Failed to fetch news for "${location}" using GNews:`, error);
        return [];
    }
};

const getNCRBData = (location) => {
    const loc = location.toLowerCase();
    for (const key in ncrbData) {
        if (loc.includes(key) && key !== 'default') {
            return ncrbData[key];
        }
    }
    return ncrbData.default;
};


// --- Route Definitions ---
router.get('/', (req, res) => {
    res.render('index', {
        locationData: null,
        underratedPlaces: mockData.underratedPlaces 
    });
});

router.get('/api/underrated-places', async (req, res) => {
    try {
        const imagePromises = mockData.underratedPlaces.map(place => fetchPexelsImages(place.name, 1));
        const imageResults = await Promise.all(imagePromises);
        const allSucceeded = imageResults.every(result => result.length > 0);
        if (!allSucceeded) throw new Error("One or more Pexels API calls failed.");
        const underratedPlacesWithImages = mockData.underratedPlaces.map((place, index) => ({
            ...place,
            image: imageResults[index][0].src.large
        }));
        res.json(underratedPlacesWithImages);
    } catch (error) {
        console.error("Error fetching live underrated places, SERVING BACKUP DATA:", error.message);
        res.json(backupUnderratedPlaces); 
    }
});

router.post('/search', isAuth, async (req, res) => {
    const locationName = req.body.location;
    if (!locationName) { return res.redirect('/'); }
    
    try {
        const locationResult = await fetchLocationData(locationName);
        if (!locationResult) { throw new Error('Location not found.'); }
        
        // Storing the searched location in the user's session
        req.session.lastSearch = {
            name: locationResult.properties.formatted,
            coords: [locationResult.properties.lat, locationResult.properties.lon]
        };
        
        const lat = locationResult.properties.lat;
        const lon = locationResult.properties.lon;

        const [pexelsResult, hotelResult] = await Promise.all([
            fetchPexelsImages(locationName, 7),
            fetchNearbyHotels(lat, lon)
        ]);

        const finalData = {
            name: locationResult.properties.formatted,
            coords: [lat, lon],
            coverImage: pexelsResult[0]?.src.large || '',
            slideshowImages: pexelsResult.slice(0, 3).map(p => p.src.large2x),
            apiImages: pexelsResult.slice(3, 7).map(p => p.src.large),
            nearbyHotels: hotelResult,
            routesInfo: `Accessible by road, rail, and air. Check local travel providers for specific routes to ${locationResult.properties.city || locationResult.properties.name}.`,
            bookingLink: "https://www.redbus.in/",
            flightLink: "https://www.makemytrip.com/flights/",
            videoSearchLink: `https://www.youtube.com/results?search_query=travel+guide+${encodeURIComponent(locationName)}`
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

// FINAL FIX: This route now correctly checks the session for a searched location.
router.get('/local-guide', isAuth, (req, res) => {
    const lastSearch = req.session.lastSearch;
    
    // If a location has been searched, pass its data to the page.
    if (lastSearch && lastSearch.coords) {
        res.render('local-guide', { 
            hasLocation: true,
            locationName: lastSearch.name.split(',')[0],
            locationCoords: lastSearch.coords 
        });
    } else {
        // Otherwise, render the page in its "prompt to search" state.
        res.render('local-guide', {
            hasLocation: false,
            locationName: null,
            locationCoords: null
        });
    }
});


// API ENDPOINT for fetching nearby places
router.get('/api/nearby-places', isAuth, async (req, res) => {
    const { lat, lon, categories } = req.query;
    if (!lat || !lon || !categories) {
        return res.status(400).json({ error: 'Latitude, longitude, and categories are required.' });
    }
    try {
        const places = await fetchNearbyPlaces(lat, lon, categories);
        res.json(places);
    } catch (error) {
        console.error('API error fetching nearby places:', error);
        res.status(500).json({ error: 'Failed to fetch nearby places.' });
    }
});

// This route now fetches weather, news, AND NCRB data
router.get('/safety-hub', isAuth, async (req, res) => {
    // Safety Hub also uses the searched location from the session.
    const location = req.session.lastSearch ? req.session.lastSearch.name : 'Delhi';
    let weatherData = null;
    let newsData = [];
    let crimeStats = null;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'PASTE_YOUR_OPENWEATHER_API_KEY_HERE') {
        console.error("OPENWEATHER API KEY is missing! Please add it to routes/index.js");
    } else {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`);
            if (!response.ok) throw new Error('Weather data not available');
            weatherData = await response.json();
        } catch (error) {
            console.error("OpenWeather API Error:", error);
        }
    }
    
    try {
        newsData = await fetchSafetyNews(location);
    } catch(error) {
        console.error("Error fetching safety news:", error);
    }

    try {
        crimeStats = getNCRBData(location);
    } catch(error) {
        console.error("Error getting NCRB data:", error);
    }

    res.render('safety-hub', { 
        weather: weatherData, 
        locationName: location,
        news: newsData,
        crimeStats: crimeStats
    });
});

module.exports = router;


