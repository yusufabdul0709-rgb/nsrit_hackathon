const express = require('express');
const router = express.Router();
const csvDataService = require('../services/csvData.service');

router.get('/locations', (req, res) => {
  const locations = csvDataService.getLocations();
  res.json({ locations });
});

router.get('/search', (req, res) => {
  const { from, to, date } = req.query;
  const results = csvDataService.searchBuses(from, to, date);
  res.json({ results });
});

module.exports = router;
