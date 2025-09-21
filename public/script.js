document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Mobile Nav Toggle & User Dropdown ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('is-open');
        });
    }

    const userMenuBtn = document.querySelector('.user-menu-btn');
    if(userMenuBtn) {
        userMenuBtn.addEventListener('click', () => {
            const dropdown = userMenuBtn.nextElementSibling;
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        // Close dropdown if clicked outside
        window.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target)) {
                userMenuBtn.nextElementSibling.style.display = 'none';
            }
        });
    }

    // --- NEW: Safety Hub Live Weather ---
    const liveClimateCard = document.getElementById('live-climate-card');
    if (liveClimateCard) {
        const weatherContainer = document.getElementById('live-weather-info');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const { latitude, longitude } = position.coords;
                try {
                    // IMPORTANT: In a real production app, this API key should NOT be exposed on the client-side.
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c3afce02ec5a996499ed9573221f677e&units=metric`);
                    if (!response.ok) throw new Error('Weather data unavailable');
                    const weather = await response.json();

                    // Auto-activate SOS if climate is critical (example: thunderstorm)
                    if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232].includes(weather.weather[0].id)) {
                        alert("WARNING: Critical weather detected at your location. Emergency services have been put on alert. (Prototype Simulation)");
                    }

                    weatherContainer.innerHTML = `
                        <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather icon">
                        <div class="weather-details">
                            <span class="temp">${Math.round(weather.main.temp)}°C</span>
                            <span class="desc">${weather.weather[0].description}</span>
                        </div>`;
                } catch (error) {
                    weatherContainer.innerHTML = `<p class="error-message">Could not fetch live weather.</p>`;
                }
            }, () => {
                weatherContainer.innerHTML = `<p class="error-message">Location access denied.</p>`;
            });
        } else {
            weatherContainer.innerHTML = `<p class="error-message">Geolocation not supported.</p>`;
        }
    }

    // --- NEW: Local Guide Page Logic ---
    const localGuideContainer = document.getElementById('local-guide-container');
    if (localGuideContainer && localGuideContainer.dataset.coords) {
        const placesList = document.getElementById('places-list');
        const tabLinks = document.querySelectorAll('.tab-link');
        const rideGroup = document.getElementById('ride-booking-group');
        const [lat, lon] = JSON.parse(localGuideContainer.dataset.coords);
        let activeCategory = 'tourism.attraction';

        const fetchAndDisplayPlaces = async () => {
            placesList.innerHTML = '<p class="loading-message">Finding nearby spots...</p>';
            try {
                const response = await fetch(`/api/nearby-places?lat=${lat}&lon=${lon}&categories=${activeCategory}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const places = await response.json();
                
                placesList.innerHTML = '';
                if (places.length > 0) {
                    places.forEach(place => {
                        const placeCard = document.createElement('div');
                        placeCard.className = 'place-card';
                        placeCard.innerHTML = `
                            <div class="place-info">
                                <strong>${place.name}</strong>
                                <p>${place.address}</p>
                            </div>
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}" target="_blank" class="btn btn-outline">View on Map</a>
                        `;
                        placesList.appendChild(placeCard);
                    });
                } else {
                    placesList.innerHTML = `<p class="no-places-message">No spots found in this category near your searched location.</p>`;
                }
            } catch (error) {
                console.error('Fetch error:', error);
                placesList.innerHTML = `<p class="error-message">Could not fetch places. Please try again later.</p>`;
            }
        };

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                activeCategory = link.dataset.category;
                fetchAndDisplayPlaces();
            });
        });
        
        // Live location for Uber/Ola
        navigator.geolocation.getCurrentPosition(pos => {
            const liveLat = pos.coords.latitude;
            const liveLon = pos.coords.longitude;
            rideGroup.innerHTML = `
                <a href="https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${liveLat}&pickup[longitude]=${liveLon}" target="_blank" class="btn btn-primary">Book with Uber</a>
                <a href="https://book.olacabs.com/?pickup_lat=${liveLat}&pickup_lng=${liveLon}" target="_blank" class="btn btn-secondary">Book with Ola</a>`;
        }, () => { rideGroup.innerHTML = `<p class="error-message">Could not get live location for ride booking.</p>`; });
        
        fetchAndDisplayPlaces(); // Initial fetch
    }


    // --- Blockchain Simulation ---
    const fakeWallet = { isConnected: false, address: '0x1A2b...c3D4' };
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => {
            if (!fakeWallet.isConnected) {
                if (confirm("Simulating Wallet Connection:\n\nDo you want to connect your digital wallet?")) {
                    fakeWallet.isConnected = true;
                    connectWalletBtn.innerHTML = `✅ Connected`;
                    connectWalletBtn.disabled = true;
                }
            }
        });
    }

    // --- Asynchronously load underrated places ---
    const suggestionsContainer = document.getElementById('suggestions-grid-container');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = `<p class="loading-message">Loading amazing places...</p>`;
        fetch('/api/underrated-places')
            .then(response => response.json())
            .then(places => {
                suggestionsContainer.innerHTML = '';
                places.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'suggestion-card';
                    card.innerHTML = `
                        <img src="${place.image}" alt="${place.name}">
                        <div class="suggestion-content">
                            <h3>${place.name}</h3>
                            <p>${place.description}</p>
                        </div>
                    `;
                    suggestionsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Failed to load suggestions:', error);
                suggestionsContainer.innerHTML = `<p class="error-message">Could not load suggestions at this time.</p>`;
            });
    }

    // --- Hero Slideshow ---
    const slideshowContainer = document.getElementById('slideshow-container');
    if (slideshowContainer) {
        try {
            const images = JSON.parse(slideshowContainer.dataset.images);
            let currentIndex = 0;
            const showImage = () => {
                if (images.length > 0) {
                    slideshowContainer.innerHTML = `<img src="${images[currentIndex]}" alt="Beautiful destination slideshow">`;
                    slideshowContainer.querySelector('img').classList.add('fade-in');
                    currentIndex = (currentIndex + 1) % images.length;
                }
            };
            if (images && images.length > 0) {
                showImage();
                setInterval(showImage, 5000);
            }
        } catch(e) { console.error("Error initializing slideshow:", e)}
    }

    // --- Map Initialization ---
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        try {
            const coords = JSON.parse(mapDiv.dataset.coords);
            const map = L.map('map').setView(coords, 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker(coords).addTo(map).bindPopup("Selected Location").openPopup();
        } catch (e) {
            console.error("Could not initialize map:", e);
        }
    }

    // --- "Add to My Tracker" (with Blockchain Simulation) ---
    const addTrackerBtn = document.querySelector('.add-tracker-btn');
    if (addTrackerBtn) {
        addTrackerBtn.addEventListener('click', (e) => {
            if (!fakeWallet.isConnected) {
                alert("Please connect your digital wallet first to save to your secure log.");
                return;
            }
            const button = e.currentTarget;
            const locationName = button.dataset.locationName;
            if (confirm(`Simulating Blockchain Transaction:\n\nSign transaction to add "${locationName}" to your secure travel log?`)) {
                const visit = {
                    name: locationName,
                    coverImage: button.dataset.coverImage,
                    date: new Date().toLocaleDateString()
                };
                let visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
                if (!visitedPlaces.some(p => p.name === visit.name)) {
                    visitedPlaces.push(visit);
                    localStorage.setItem('visitedPlaces', JSON.stringify(visitedPlaces));
                    alert(`${visit.name} has been securely added to your journey!`);
                } else {
                    alert(`${visit.name} is already in your journey tracker.`);
                }
            }
        });
    }

    // --- "My Journey So Far" Page ---
    const journeyList = document.getElementById('journey-list');
    if (journeyList) {
        const renderJourneyList = () => {
            const visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
            journeyList.innerHTML = '';
            if (visitedPlaces.length > 0) {
                visitedPlaces.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'journey-card card';
                    card.innerHTML = `
                        <img src="${place.coverImage}" alt="${place.name}">
                        <div class="journey-content">
                            <h3>${place.name}</h3>
                            <p>Visited on: ${place.date}</p>
                        </div>
                        <button class="btn-delete" data-place-name="${place.name}">Remove</button>
                    `;
                    journeyList.appendChild(card);
                });
            } else {
                journeyList.innerHTML = `<p class="no-places-message">You haven't tracked any places yet.</p>`;
            }
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', (e) => {
                    const placeNameToDelete = e.currentTarget.dataset.placeName;
                    if (confirm(`Are you sure you want to remove ${placeNameToDelete} from your journey?`)) {
                        let currentPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
                        currentPlaces = currentPlaces.filter(p => p.name !== placeNameToDelete);
                        localStorage.setItem('visitedPlaces', JSON.stringify(currentPlaces));
                        renderJourneyList();
                    }
                });
            });
        };
        renderJourneyList();
    }

    // --- Rescue Button ---
        // --- NEW: Separate SOS Link Activation ---
    const navbarSosLink = document.getElementById('navbar-sos-link');
    if (navbarSosLink) {
        navbarSosLink.addEventListener('click', (event) => {
            event.preventDefault(); // Stop the link from navigating
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    alert(`URGENT RESCUE ALERT SENT!\n\nAuthorities have been notified with your live location:\nLatitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}\n\n(This is a prototype simulation.)`);
                }, () => {
                    alert('Could not get your location. Please ensure location services are enabled.');
                });
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
    const rescueBtns = document.querySelectorAll('.rescue-btn'); // Use querySelectorAll to find ALL rescue buttons
    if (rescueBtns.length > 0) {
        rescueBtns.forEach(btn => { // Loop through each button found
            btn.addEventListener('click', (event) => {
                event.preventDefault(); // This stops any link from changing the URL
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        alert(`URGENT RESCUE ALERT SENT!\n\nAuthorities have been notified with your live location:\nLatitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}\n\n(You will be rescued soon.)`);
                    }, () => {
                        alert('Could not get your location. Please ensure location services are enabled.');
                    });
                } else {
                    alert('Geolocation is not supported by your browser.');
                }
            });
        });
    }


    // --- Submit Discovery Form ---
    const discoveryForm = document.getElementById('discovery-form');
    if (discoveryForm) {
        discoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your submission! Your discovery will be reviewed. (Prototype simulation)');
            discoveryForm.reset();
        });
    }
});