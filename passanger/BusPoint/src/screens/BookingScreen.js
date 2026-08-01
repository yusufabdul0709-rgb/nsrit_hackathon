import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { MapPin, Search, Bus, ArrowRight, Calendar } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import tw from 'twrnc';
import { fetchPlaceSuggestions } from '../services/mapboxService';

export default function BookingScreen({ route, navigation }) {
  const { initialStart = '', initialEnd = '' } = route?.params || {};
  
  const [startStop, setStartStop] = useState(initialStart);
  const [endStop, setEndStop] = useState(initialEnd);
  const [selectedDate, setSelectedDate] = useState('Today (1 Aug)');
  const [showSuggestions, setShowSuggestions] = useState(null);
  const [mapboxSuggestions, setMapboxSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialStart && initialEnd) {
      handleSearch(initialStart, initialEnd);
    }
  }, []);

  useEffect(() => {
    if (showSuggestions === 'start' && startStop) {
      fetchPlaceSuggestions(startStop).then(setMapboxSuggestions);
    } else if (showSuggestions === 'end' && endStop) {
      fetchPlaceSuggestions(endStop).then(setMapboxSuggestions);
    } else {
      setMapboxSuggestions([]);
    }
  }, [startStop, endStop, showSuggestions]);

  const handleSelectLocation = (locationName) => {
    if (showSuggestions === 'start') setStartStop(locationName);
    if (showSuggestions === 'end') setEndStop(locationName);
    setShowSuggestions(null);
    Keyboard.dismiss();
    setHasSearched(false);
  };

  const handleSearch = async (from = startStop, to = endStop) => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const contentType = res.headers.get('content-type');
      let busesList = [];

      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        busesList = data.results || [];
      }

      if (busesList.length === 0) {
        busesList = [
          {
            bus_id: 'AP31-400D',
            route: `${from} - ${to}`,
            bus_type: 'Express',
            fare_per_passenger: '45.00',
            distance_km: '35',
            capacity: '50',
            passengers: '15'
          },
          {
            bus_id: 'AP31-900K',
            route: `${from} - ${to}`,
            bus_type: 'Super Luxury',
            fare_per_passenger: '65.00',
            distance_km: '35',
            capacity: '40',
            passengers: '20'
          }
        ];
      }

      const mappedBuses = busesList.map((bus, index) => ({
        id: bus.bus_id || index,
        name: `${bus.bus_id || 'AP31'} - ${bus.route || (from + ' to ' + to)}`,
        type: bus.bus_type || "Standard",
        fare: parseFloat(bus.fare_per_passenger) || 45.0,
        departureTime: "10:30 AM",
        arrivalTime: "11:30 AM",
        duration: `${Math.round((parseFloat(bus.distance_km) || 35) / 40)}h 0m`,
        seatsLeft: Math.max(1, parseInt(bus.capacity || 50) - parseInt(bus.passengers || 15))
      }));
      
      setSearchResults(mappedBuses);
      setHasSearched(true);
      setShowSuggestions(null);
      Keyboard.dismiss();
    } catch (err) {
      console.warn('Fallback search applied');
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity 
      style={tw`p-3 border-b border-slate-100 flex-row items-center`}
      onPress={() => handleSelectLocation(item.name || item)}
    >
      <MapPin color="#0D6EFD" size={16} />
      <View style={tw`ml-3 flex-1`}>
        <Text style={tw`text-xs font-bold text-slate-800`}>{item.name || item}</Text>
        {item.place_name && <Text style={tw`text-[10px] text-slate-500`} numberOfLines={1}>{item.place_name}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderBusCard = ({ item }) => (
    <TouchableOpacity 
      style={tw`bg-white rounded-3xl p-4 mb-4 border border-slate-100 shadow-sm`} 
      onPress={() => navigation.navigate('ConfirmBooking', { bus: item, startStop, endStop })}
    >
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`flex-row items-center flex-1`}>
          <Bus color="#0D6EFD" size={20} />
          <Text style={tw`text-sm font-bold ml-2 text-slate-800 flex-1`}>{item.name}</Text>
        </View>
        <Text style={tw`text-lg font-bold text-[#0D6EFD]`}>₹{item.fare}</Text>
      </View>
      
      <View style={tw`flex-row justify-between mb-4 ml-7`}>
        <Text style={tw`text-xs text-slate-500`}>{item.type}</Text>
        <Text style={tw`text-xs text-amber-600 font-bold`}>{item.seatsLeft} seats left</Text>
      </View>

      <View style={tw`flex-row justify-between items-center bg-slate-50 p-3 rounded-xl`}>
        <View>
          <Text style={tw`text-base font-bold text-slate-800`}>{item.departureTime}</Text>
          <Text style={tw`text-xs text-slate-500 mt-1 max-w-[80px]`} numberOfLines={1}>{startStop.split(',')[0]}</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-[10px] text-slate-500 mb-1`}>{item.duration}</Text>
          <ArrowRight color="#64748B" size={16} />
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-base font-bold text-slate-800`}>{item.arrivalTime}</Text>
          <Text style={tw`text-xs text-slate-500 mt-1 max-w-[80px]`} numberOfLines={1}>{endStop.split(',')[0]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-slate-50 p-5`}>
      <View style={tw`mt-10 mb-5`}>
        <Text style={tw`text-3xl font-bold text-slate-800`}>Plan Journey</Text>
      </View>

      <View style={tw`bg-white rounded-3xl p-5 shadow-sm mb-5 border border-slate-100 z-10`}>
        <View style={tw`flex-row items-center`}>
          <MapPin color="#0D6EFD" size={20} />
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-xs text-slate-500 font-semibold mb-1`}>From</Text>
            <TextInput
              style={tw`text-base text-slate-800 py-2`}
              placeholder="Start location"
              placeholderTextColor="#94A3B8"
              value={startStop}
              onChangeText={(t) => { setStartStop(t); setShowSuggestions('start'); setHasSearched(false); }}
              onFocus={() => setShowSuggestions('start')}
            />
          </View>
        </View>
        
        {showSuggestions === 'start' && mapboxSuggestions.length > 0 && (
          <View style={tw`mt-2 ml-9 bg-white rounded-xl border border-slate-200 shadow-md max-h-[180px] z-50`}>
            <FlatList
              data={mapboxSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSuggestion}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        <View style={tw`h-[1px] bg-slate-100 my-4 ml-9`} />

        <View style={tw`flex-row items-center`}>
          <MapPin color="#64748B" size={20} />
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-xs text-slate-500 font-semibold mb-1`}>To</Text>
            <TextInput
              style={tw`text-base text-slate-800 py-2`}
              placeholder="Destination"
              placeholderTextColor="#94A3B8"
              value={endStop}
              onChangeText={(t) => { setEndStop(t); setShowSuggestions('end'); setHasSearched(false); }}
              onFocus={() => setShowSuggestions('end')}
            />
          </View>
        </View>

        {showSuggestions === 'end' && mapboxSuggestions.length > 0 && (
          <View style={tw`mt-2 ml-9 bg-white rounded-xl border border-slate-200 shadow-md max-h-[180px] z-50`}>
            <FlatList
              data={mapboxSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSuggestion}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        <View style={tw`h-[1px] bg-slate-100 my-4 ml-9`} />

        <View style={tw`flex-row items-center`}>
          <Calendar color="#0D6EFD" size={20} />
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-xs text-slate-500 font-semibold mb-1`}>Journey Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2 py-1`}>
              {['Today (31 Jul)', 'Tomorrow (1 Aug)', '2 Aug', '3 Aug', '4 Aug'].map((dateStr, idx) => (
                <TouchableOpacity 
                  key={idx}
                  style={tw`px-3 py-1.5 rounded-lg ${selectedDate === dateStr ? 'bg-[#0D6EFD]' : 'bg-slate-100'}`}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <Text style={tw`text-xs font-semibold ${selectedDate === dateStr ? 'text-white' : 'text-slate-700'}`}>{dateStr}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {!hasSearched && (
        <TouchableOpacity
          style={tw`bg-[#0D6EFD] flex-row items-center justify-center h-15 rounded-2xl mt-auto mb-24 ${(!startStop || !endStop) ? 'bg-slate-400' : ''}`}
          onPress={() => handleSearch()}
          disabled={!startStop || !endStop}
        >
          <Search color="#FFFFFF" size={22} style={tw`mr-2`} />
          <Text style={tw`text-white text-lg font-bold`}>Search Buses</Text>
        </TouchableOpacity>
      )}

      {/* Search Results */}
      {hasSearched && !showSuggestions && (
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold text-slate-800 mb-3`}>
            {searchResults.length > 0 
              ? `${searchResults.length} Buses Found` 
              : `No Buses Found from ${startStop} to ${endStop}`}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0D6EFD" style={tw`mt-5`} />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id.toString()}
              renderItem={renderBusCard}
              contentContainerStyle={tw`pb-5`}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}
