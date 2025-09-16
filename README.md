Xenagos is a dynamic and intuitive web application designed to be a smart and safe companion for modern tourists. It allows users to search for destinations, view stunning photos, explore locations on an interactive map, discover nearby hotels, and keep a personal log of their travels.

✨ Features
🔐 Secure User Authentication: Users can sign up and log in to a personal account, with password hashing for security.

🔍 Powerful Destination Search: Search for any city or landmark worldwide to get detailed information.

🖼️ Dynamic Image Gallery: Utilizes the Pexels API to fetch and display beautiful, high-quality images of the searched location.

🗺️ Interactive Map View: Integrates with Leaflet.js and Geoapify to show the precise location of the destination on a map.

🏨 Nearby Hotel Suggestions: Automatically finds and lists hotels near the searched destination using the Geoapify Places API.

✈️ Personal Journey Tracker: Log visited places and view them in a personalized "My Journey So Far" gallery. (Uses browser Local Storage for persistence).

💡 Underrated Place Suggestions: Offers a curated list of beautiful, less-crowded destinations to inspire your next trip.

▶️ Video Exploration: Provides a direct link to search for travel vlogs and guides of the destination on YouTube.

🚀 Responsive Design: A clean and modern user interface that works seamlessly on both desktop and mobile devices.

🛠️ Tech Stack
Backend: Node.js, Express.js

Frontend: EJS (Embedded JavaScript), CSS3, Vanilla JavaScript

Authentication: express-session for session management and bcrypt for password hashing.

Database: A simple users.json file for persistent user storage.

APIs:

Pexels API: For sourcing high-quality destination photos.

Geoapify API: For geocoding, reverse geocoding, and finding nearby places (hotels).

Mapping: Leaflet.js with OpenStreetMap tiles.

📁 Project Structure
xenagos/
├── public/
│   ├── css/style.css       # Main stylesheet
│   ├── js/script.js        # Frontend JavaScript for interactivity
│   └── images/             # Static images and logo
├── routes/
│   ├── auth.js             # Handles all authentication routes (login, signup, logout)
│   └── index.js            # Handles core application routes (search, home, journey)
├── views/
│   ├── partials/           # EJS partials (header, footer)
│   ├── index.ejs           # Homepage and search results view
│   ├── journey.ejs         # "My Journey So Far" page
│   ├── login.ejs           # Login page
│   └── signup.ejs          # Signup page
├── mock-data.js            # Data for underrated place suggestions
├── users.json              # File-based database for user credentials
├── server.js               # The main Express server entry point
├── package.json
└── README.md

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
You need to have Node.js and npm installed on your computer.

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/xenagos.git](https://github.com/your-username/xenagos.git)
cd xenagos

Install dependencies:

npm install

Add API Keys:
This project requires API keys from Pexels and Geoapify. Open the routes/index.js file and replace the placeholder keys with your own:

// In routes/index.js
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY';
const GEOAPIFY_API_KEY = 'YOUR_GEOAPIFY_API_KEY';

Run the server:

node server.js

Open your browser and navigate to http://localhost:3000.

Usage
Sign Up: Create a new account to get started.

Search: On the home page, enter a city, landmark, or destination you want to explore.

Explore: View the search results, including a map, an image slideshow, and a list of nearby hotels.

Track Your Journey: If you like the place, click "Add to My Tracker".

View Your Travels: Navigate to the "My Journey So Far" page to see a gallery of all the places you've tracked.

This project was created by wizhimanshu, antiperfect & ace-HiteshSingh
