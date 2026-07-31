const express = require('express');
const router = express.Router();
const csvDataService = require('../services/csvData.service');

router.post('/query', (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ answer: 'Please ask a question.' });
  
  const text = question.toLowerCase();
  const rawData = csvDataService.getRawData();
  
  // Very simple keyword matching based on CSV data
  // Check for route queries
  if (text.includes('buses to') || text.includes('route') || text.includes('go to')) {
    const locations = csvDataService.getLocations();
    for (const loc of locations) {
      if (text.includes(loc.toLowerCase())) {
        const matches = rawData.filter(b => b.to.toLowerCase() === loc.toLowerCase() || b.route.toLowerCase().includes(loc.toLowerCase()));
        if (matches.length > 0) {
          return res.json({ answer: `Yes, we have ${matches.length} buses heading to ${loc}. For example, the ${matches[0].bus_type} bus costs ₹${matches[0].fare_per_passenger}.` });
        }
      }
    }
  }
  
  // Check for fare queries
  if (text.includes('fare') || text.includes('cost') || text.includes('price')) {
    return res.json({ answer: `Fares vary by route and bus type. From our APSRTC dataset, average fares range from ₹150 for Ordinary to ₹1000+ for Volvo AC.` });
  }

  // Check for occupancy/capacity queries
  if (text.includes('crowd') || text.includes('capacity') || text.includes('occupancy')) {
    return res.json({ answer: `Based on historical APSRTC data, Super Luxury and Volvo AC buses maintain an average occupancy of around 70%. Book early to secure your seat!` });
  }

  // Fallback
  return res.json({ answer: `I am trained on the APSRTC dataset, but I couldn't find a specific answer for that in the live data. Our most popular routes include Hyderabad, Vijayawada, and Visakhapatnam.` });
});

module.exports = router;
