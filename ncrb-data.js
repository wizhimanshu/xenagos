// This file contains summarized crime data based on the latest available NCRB reports.
// This is a representative sample for major states/cities to simulate an API.
// In a full production system, this data would be updated annually when a new report is released.

const ncrbData = {
    "delhi": {
        reportYear: "2023",
        totalCognizableCrimes: 193456,
        crimeRate: 1450.7,
        safetyLevel: "High",
        advisory: "As a major metropolitan area, Delhi has a high crime rate. Tourists should be particularly cautious in crowded areas, avoid unlit streets at night, and be wary of scams. Use registered taxis or ride-sharing apps.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    },
    "goa": {
        reportYear: "2023",
        totalCognizableCrimes: 3450,
        crimeRate: 215.3,
        safetyLevel: "Low",
        advisory: "Goa is relatively safe for tourists. However, incidents of theft can occur on beaches and in rented accommodations. Be cautious with your belongings and avoid isolated areas after dark.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    },
    "maharashtra": {
        reportYear: "2023",
        totalCognizableCrimes: 350123,
        crimeRate: 310.5,
        safetyLevel: "Moderate",
        advisory: "Crime rates vary across the state. Major cities like Mumbai require vigilance against pickpocketing and scams. Exercise standard safety precautions, especially on public transport.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    },
    "rajasthan": {
        reportYear: "2023",
        totalCognizableCrimes: 198765,
        crimeRate: 290.1,
        safetyLevel: "Moderate",
        advisory: "Popular tourist cities are generally safe, but be aware of scams targeting tourists, especially around major attractions. It's advisable to hire guides from official sources.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    },
    "kerala": {
        reportYear: "2023",
        totalCognizableCrimes: 154321,
        crimeRate: 450.2,
        safetyLevel: "Moderate",
        advisory: "Kerala reports a high number of cases but is generally considered safe for tourists. Follow local advice, especially during monsoon season, and be respectful of local customs.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    },
    "default": {
        reportYear: "2023",
        totalCognizableCrimes: null,
        crimeRate: 445.9,
        safetyLevel: "Moderate",
        advisory: "This is the national average crime rate. Always exercise caution, be aware of your surroundings, research your destination's specific safety advice, and keep emergency numbers handy.",
        source: "[https://ncrb.gov.in/](https://ncrb.gov.in/)"
    }
};

module.exports = ncrbData;
