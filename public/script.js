document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');

    // Only initialize map if the map container is on the page
    if (mapDiv) {
        try {
            const coords = JSON.parse(mapDiv.dataset.coords);
            const map = L.map('map').setView(coords, 11);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            L.marker(coords).addTo(map).bindPopup("Selected Location").openPopup();
        } catch (e) {
            console.error("Could not initialize map:", e);
            mapDiv.innerHTML = "<p>Could not load map.</p>";
        }
    }
});