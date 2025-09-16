document.addEventListener('DOMContentLoaded', () => {

    // --- FEATURE: HERO SLIDESHOW ---
    const slideshowContainer = document.getElementById('slideshow-container');
    if (slideshowContainer) {
        try {
            const images = JSON.parse(slideshowContainer.dataset.images);
            let currentIndex = 0;
            
            const showImage = () => {
                if (images.length > 0) {
                    slideshowContainer.innerHTML = `<img src="${images[currentIndex]}" alt="Beautiful destination slideshow">`;
                    const imgElement = slideshowContainer.querySelector('img');
                    imgElement.classList.add('fade-in');
                    currentIndex = (currentIndex + 1) % images.length;
                }
            };

            if (images && images.length > 0) {
                showImage();
                setInterval(showImage, 5000);
            }
        } catch(e) { console.error("Error initializing slideshow:", e)}
    }

    // --- FEATURE: MAP INITIALIZATION ---
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

    // --- FEATURE: "ADD TO MY TRACKER" ---
    const addTrackerBtn = document.querySelector('.add-tracker-btn');
    if (addTrackerBtn) {
        addTrackerBtn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const visit = {
                name: button.dataset.locationName,
                coverImage: button.dataset.coverImage,
                coords: JSON.parse(button.dataset.coords),
                date: new Date().toLocaleDateString()
            };

            let visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
            if (!visitedPlaces.some(p => p.name === visit.name)) {
                visitedPlaces.push(visit);
                localStorage.setItem('visitedPlaces', JSON.stringify(visitedPlaces));
                alert(`${visit.name} has been added to your journey!`);
            } else {
                alert(`${visit.name} is already in your journey tracker.`);
            }
        });
    }

    // --- FEATURE: "MY JOURNEY SO FAR" PAGE ---
    const journeyList = document.getElementById('journey-list');
    if (journeyList) {
        const renderJourneyList = () => {
            const visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
            journeyList.innerHTML = '';

            if (visitedPlaces.length > 0) {
                visitedPlaces.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'journey-card';
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

    // --- FEATURE: RESCUE BUTTON ---
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

    // --- FEATURE: SUBMIT DISCOVERY FORM ---
    const discoveryForm = document.getElementById('discovery-form');
    if (discoveryForm) {
        discoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your submission! Your discovery will be reviewed. (Prototype simulation)');
            discoveryForm.reset();
        });
    }
});