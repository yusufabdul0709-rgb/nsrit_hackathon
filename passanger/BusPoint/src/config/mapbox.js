export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAP_BOX_API || process.env.MAP_BOX_API || 'pk.eyJ1IjoieXVzdWZhYmR1bDA3MDkiLCJhIjoiY21yejZuN3p1MGR2cjJ3cHluOTg1aTdrZiJ9.ZIQVuLFNzhTi3GppnXc6Dg';

// Sample Bus Route coordinates (Visakhapatnam - Anakapalle Route)
export const MOCK_BUS_STOPS = [
  { id: 1, name: 'RTC Complex', lat: 17.7231, lng: 83.3012, schedArr: '10:00 AM', liveArr: '10:02 AM', schedDep: '10:15 AM', liveDep: '10:17 AM', distance: '0 km', bay: 'Bay 2', platform: '2' },
  { id: 2, name: 'Maddilapalem', lat: 17.7340, lng: 83.3175, schedArr: '10:25 AM', liveArr: '10:28 AM', schedDep: '10:30 AM', liveDep: '10:32 AM', distance: '12 km', bay: 'Bay 1', platform: '1' },
  { id: 3, name: 'NAD Junction', lat: 17.7490, lng: 83.2450, schedArr: '10:50 AM', liveArr: '10:55 AM', schedDep: '10:55 AM', liveDep: '10:58 AM', distance: '25 km', bay: 'Bay 3', platform: '3' },
  { id: 4, name: 'Gajuwaka', lat: 17.6900, lng: 83.2100, schedArr: '11:15 AM', liveArr: '11:20 AM', schedDep: '11:20 AM', liveDep: '11:22 AM', distance: '39 km', bay: 'Bay 2', platform: '2' },
  { id: 5, name: 'Kurmannapalem', lat: 17.6750, lng: 83.1800, schedArr: '11:35 AM', liveArr: '11:38 AM', schedDep: '11:40 AM', liveDep: '11:42 AM', distance: '53 km', bay: 'Bay 1', platform: '1' },
  { id: 6, name: 'Anakapalle', lat: 17.6895, lng: 83.0024, schedArr: '12:05 PM', liveArr: '12:10 PM', schedDep: '12:10 PM', liveDep: '12:15 PM', distance: '72 km', bay: 'Bay 4', platform: '4' },
];
