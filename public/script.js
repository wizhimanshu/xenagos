document.addEventListener('DOMContentLoaded', () => {

    // --- Blockchain Simulation ---
    const fakeWallet = {
        isConnected: false,
        address: '0x1A2b...c3D4' // A sample wallet address
    };

    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => {
            if (!fakeWallet.isConnected) {
                if (confirm("Simulating Wallet Connection:\n\nDo you want to connect your digital wallet?")) {
                    fakeWallet.isConnected = true;
                    connectWalletBtn.textContent = `✅ Connected: ${fakeWallet.address}`;
                    connectWalletBtn.disabled = true;
                    connectWalletBtn.style.cursor = 'default';
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
                console.log(`Transaction approved. Adding "${locationName}" to travel history...`);
                const visit = {
                    name: locationName,
                    coverImage: button.dataset.coverImage,
                    coords: JSON.parse(button.dataset.coords),
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
            } else {
                console.log("User rejected the transaction.");
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
                    card.className = 'journey-card card'; // Added .card for consistent styling
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
    const rescueBtn = document.querySelector('.rescue-btn');
    if (rescueBtn) {
        rescueBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    alert(`URGENT RESCUE ALERT SENT!\nAuthorities have been notified with your location:\nLatitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}\n(This is a prototype simulation.)`);
                }, () => {
                    alert('Could not get your location. Please ensure location services are enabled.');
                });
            } else {
                alert('Geolocation is not supported by your browser.');
            }
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