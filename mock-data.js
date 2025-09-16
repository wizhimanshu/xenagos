const mockData = {
    locations: {
        "goa": {
            name: "Goa",
            coords: [15.2993, 74.1240],
            coverImage: "https://images.unsplash.com/photo-1590374504364-0d425b4f62e7?q=80&w=800",
            slideshowImages: [
                "https://images.unsplash.com/photo-1560179406-4f63696a4dd8?q=80&w=1200",
                "https://images.unsplash.com/photo-1570222723321-AC9920b16259?q=80&w=1200",
                "https://images.unsplash.com/photo-1614082242765-7c9de5224386?q=80&w=1200"
            ],
            routesInfo: "Well-connected by air (Dabolim Airport), rail (Madgaon & Vasco-da-Gama), and an extensive network of roads like NH66.",
            bookingLink: "https://www.redbus.in/",
            flightLink: "https://www.makemytrip.com/flights/",
            images: [
                "https://images.unsplash.com/photo-1560179406-4f63696a4dd8?q=80&w=400",
                "https://images.unsplash.com/photo-1570222723321-AC9920b16259?q=80&w=400",
                "https://images.unsplash.com/photo-1614082242765-7c9de5224386?q=80&w=400"
            ],
            videos: [
                { title: "A Cinematic Travel Film", youtubeId: "3sL0omw_T5o" },
                { title: "Exploring North Goa", youtubeId: "c3eP9aB6k9g" }
            ]
        },
        "delhi": {
            name: "Delhi",
            coords: [28.7041, 77.1025],
            coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
            slideshowImages: [
                "https://images.unsplash.com/photo-1605792288465-1d1a9c11363c?q=80&w=1200",
                "https://images.unsplash.com/photo-1557090495-246a2a265324?q=80&w=1200",
                "https://images.unsplash.com/photo-1596639410342-34d6389a3138?q=80&w=1200"
            ],
            routesInfo: "Major international hub with Indira Gandhi International Airport, multiple major railway stations (NDLS, NZM), and extensive metro and road networks.",
            bookingLink: "https://www.ixigo.com/buses",
            flightLink: "https://www.goibibo.com/flights/",
            images: [
                "https://images.unsplash.com/photo-1605792288465-1d1a9c11363c?q=80&w=400",
                "https://images.unsplash.com/photo-1557090495-246a2a265324?q=80&w=400",
                "https://images.unsplash.com/photo-1596639410342-34d6389a3138?q=80&w=400"
            ],
            videos: [
                { title: "Delhi Travel Guide", youtubeId: "4W4_B3s4T9o" },
                { title: "A Day in Old Delhi", youtubeId: "OpH0weJ4F50" }
            ]
        }
    },
    underratedPlaces: [
        {
            name: "Ziro Valley, Arunachal Pradesh",
            description: "A lush, green paradise known for its tranquil beauty and the vibrant Apatani culture.",
            image: "https://images.unsplash.com/photo-1626932731704-5ded141443b7?q=80&w=600"
        },
        {
            name: "Gokarna, Karnataka",
            description: "A serene coastal town offering pristine beaches and a more laid-back vibe than Goa.",
            image: "https://images.unsplash.com/photo-1621689228722-6d45e146c241?q=80&w=600"
        },
        {
            name: "Khajjiar, Himachal Pradesh",
            description: "Often called the 'Mini Switzerland of India', this meadow is a stunning natural retreat.",
            image: "https://images.unsplash.com/photo-1625349424362-235884219933?q=80&w=600"
        }
    ]
};

module.exports = mockData;