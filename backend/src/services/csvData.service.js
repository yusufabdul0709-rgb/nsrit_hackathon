const fs = require('fs');
const path = require('path');

let busData = [];
let uniqueLocations = new Set();

const loadCSVData = () => {
  try {
    const csvFilePath = path.join(__dirname, '../../datasets/APSRTC_Transport_Data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim() : '';
      });

      if (row.route) {
        const [from, to] = row.route.split('-');
        if (from) uniqueLocations.add(from.trim());
        if (to) uniqueLocations.add(to.trim());
        
        row.from = from ? from.trim() : '';
        row.to = to ? to.trim() : '';
      }
      
      busData.push(row);
    }
    
    console.log(`✅ Loaded ${busData.length} bus records from CSV.`);
    console.log(`✅ Extracted ${uniqueLocations.size} unique locations.`);
  } catch (error) {
    console.error('Error loading CSV data:', error);
  }
};

const getLocations = () => {
  return Array.from(uniqueLocations).sort();
};

const searchBuses = (from, to, date) => {
  const cleanFrom = (from || '').trim().toLowerCase();
  const cleanTo = (to || '').trim().toLowerCase();

  let matches = busData.filter(bus => {
    const busFrom = (bus.from || '').toLowerCase();
    const busTo = (bus.to || '').toLowerCase();
    const busRoute = (bus.route || '').toLowerCase();

    const matchFrom = !cleanFrom || busFrom.includes(cleanFrom) || cleanFrom.includes(busFrom) || busRoute.includes(cleanFrom);
    const matchTo = !cleanTo || busTo.includes(cleanTo) || cleanTo.includes(busTo) || busRoute.includes(cleanTo);

    return matchFrom && matchTo;
  });

  // If no direct matches, fallback to returning sample buses for presentation/hackathon demo
  if (matches.length === 0 && busData.length > 0) {
    matches = busData.slice(0, 5);
  }

  return matches;
};

const getRawData = () => busData;

module.exports = {
  loadCSVData,
  getLocations,
  searchBuses,
  getRawData
};
