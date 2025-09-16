const mockData = {
    "goa": {
        name: "Goa",
        coords: [15.2993, 74.1240],
        routesInfo: "Well-connected by air (Dabolim Airport), rail (Madgaon & Vasco-da-Gama), and an extensive network of roads like NH66.",
        bookingLink: "https://www.redbus.in/",
        safety: {
            crimeRate: "Low",
            climate: "Tropical Monsoon (Hot and humid)",
            realTimeVideo: "nGMge0_eA8" // YouTube ID for a travel video
        },
        images: [
            "https://images.unsplash.com/photo-1560179406-4f63696a4dd8?q=80&w=2574",
            "https://images.unsplash.com/photo-1590374504364-0d425b4f62e7?q=80&w=2670",
            "https://images.unsplash.com/photo-1570222723321-AC9920b16259?q=80&w=2670"
        ],
        videos: [
            { title: "A Cinematic Travel Film", youtubeId: "3sL0omw_T5o" },
            { title: "Exploring North Goa", youtubeId: "c3eP9aB6k9g" }
        ]
    },
    "delhi": {
        name: "Delhi",
        coords: [28.7041, 77.1025],
        routesInfo: "Major international hub with Indira Gandhi International Airport, multiple major railway stations (NDLS, NZM), and extensive metro and road networks.",
        bookingLink: "https://www.makemytrip.com/flights/",
        safety: {
            crimeRate: "Moderate",
            climate: "Humid Subtropical (Extreme summers and winters)",
            realTimeVideo: "V_jq2t_pWmg"
        },
        images: [
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2574",
            "https://images.unsplash.com/photo-1605792288465-1d1a9c11363c?q=80&w=2670",
            "https://images.unsplash.com/photo-1557090495-246a2a265324?q=80&w=2574"
        ],
        videos: [
            { title: "Delhi Travel Guide", youtubeId: "4W4_B3s4T9o" },
            { title: "A Day in Old Delhi", youtubeId: "OpH0weJ4F50" }
        ]
    }
};

module.exports = mockData;