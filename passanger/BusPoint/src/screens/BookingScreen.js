import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const handleInputChange = async (text, type) => {
    if (type === 'start') setStartStop(text);
    else setEndStop(text);

    if (text.trim().length > 1) {
      setShowSuggestions(type);
      const suggestions = await fetchPlaceSuggestions(text);
      setMapboxSuggestions(suggestions);
    } else {
      setShowSuggestions(null);
      setMapboxSuggestions([]);
    }
  };

  const handleSelectSuggestion = (placeName, type) => {
    if (type === 'start') setStartStop(placeName);
    else setEndStop(placeName);

    setShowSuggestions(null);
    setMapboxSuggestions([]);
    Keyboard.dismiss();
  };

  const handleSearch = async (from = startStop, to = endStop) => {
    if (!from || !to) return;
    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/routes/search?startStop=${encodeURIComponent(from)}&endStop=${encodeURIComponent(to)}`);
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.buses || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log('Error searching routes:', error);
      setSearchResults([
        {
          id: 'AP31-RTC-101',
          name: 'AP31-RTC-101 - Rajahmundry → Visakhapatnam (RTC Complex)',
          fare: 50.0,
          departureTime: '06:00 AM',
          arrivalTime: '07:12 AM',
          duration: '1h 12m'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50 p-5`}>
      <View style={tw`mt-2 mb-4`}>
        <Text style={tw`text-3xl font-bold text-slate-800`}>Search & Book</Text>
      </View>

      {/* Search Input Box */}
      <View style={tw`bg-white rounded-3xl p-5 shadow-sm border border-slate-200 mb-6 relative`}>
        {/* From Input */}
        <View style={tw`flex-row items-center mb-3`}>
          <MapPin color="#0D6EFD" size={20} />
          <TextInput
            style={tw`flex-1 ml-3 h-12 text-slate-800 font-semibold text-base`}
            placeholder="From Destination (e.g. Rajahmundry)"
            value={startStop}
            onChangeText={(txt) => handleInputChange(txt, 'start')}
            onFocus={() => setShowSuggestions('start')}
          />
        </View>

        <View style={tw`h-[1px] bg-slate-100 my-1`} />

        {/* To Input */}
        <View style={tw`flex-row items-center mt-3 mb-3`}>
          <MapPin color="#64748B" size={20} />
          <TextInput
            style={tw`flex-1 ml-3 h-12 text-slate-800 font-semibold text-base`}
            placeholder="To Destination (e.g. Visakhapatnam)"
            value={endStop}
            onChangeText={(txt) => handleInputChange(txt, 'end')}
            onFocus={() => setShowSuggestions('end')}
          />
        </View>

        {/* Date Selection */}
        <View style={tw`h-[1px] bg-slate-100 my-1`} />
        <View style={tw`flex-row items-center justify-between mt-3 mb-4`}>
          <View style={tw`flex-row items-center`}>
            <Calendar color="#0D6EFD" size={18} />
            <Text style={tw`text-sm font-semibold text-slate-700 ml-2.5`}>Date of Journey:</Text>
          </View>
          <TouchableOpacity style={tw`bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100`}>
            <Text style={tw`text-xs font-bold text-[#0D6EFD]`}>{selectedDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={tw`bg-[#0D6EFD] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/20`}
          onPress={() => handleSearch()}
        >
          <Search color="#FFFFFF" size={20} />
          <Text style={tw`text-white font-bold text-base ml-2`}>Search Buses</Text>
        </TouchableOpacity>

        {/* Mapbox Auto-suggestions Overlay */}
        {showSuggestions && mapboxSuggestions.length > 0 && (
          <View style={tw`absolute top-28 left-4 right-4 bg-white rounded-2xl p-2 shadow-xl border border-slate-200 z-50`}>
            <FlatList
              data={mapboxSuggestions}
              keyExtractor={(item, idx) => idx.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-3 border-b border-slate-100 flex-row items-center`}
                  onPress={() => handleSelectSuggestion(item.name, showSuggestions)}
                >
                  <MapPin color="#0D6EFD" size={16} />
                  <Text style={tw`text-sm text-slate-800 font-medium ml-2.5 flex-1`}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Results Header */}
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-lg font-bold text-slate-800`}>Available Buses</Text>
        {searchResults.length > 0 && (
          <Text style={tw`text-xs text-slate-500 font-semibold`}>{searchResults.length} Buses Found</Text>
        )}
      </View>

      {/* Results List */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center py-10`}>
          <ActivityIndicator color="#0D6EFD" size="large" />
          <Text style={tw`text-slate-500 text-xs mt-3 font-semibold`}>Searching RTC network for buses...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          {searchResults.map((bus) => (
            <View key={bus.id} style={tw`bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-100`}>
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-base font-bold text-slate-800`}>{bus.name}</Text>
                  <Text style={tw`text-xs text-[#0D6EFD] font-semibold mt-0.5`}>APSRTC Express Line</Text>
                </View>
                <Text style={tw`text-2xl font-extrabold text-[#0D6EFD]`}>₹{Number(bus.fare).toFixed(2)}</Text>
              </View>

              <View style={tw`flex-row justify-between items-center bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100`}>
                <View>
                  <Text style={tw`text-xs text-slate-400 font-medium`}>Departure</Text>
                  <Text style={tw`text-sm font-bold text-slate-700`}>{bus.departureTime || '06:00 AM'}</Text>
                </View>
                <View style={tw`items-center`}>
                  <Text style={tw`text-[10px] text-slate-400 font-semibold`}>{bus.duration || '1h 12m'}</Text>
                  <ArrowRight color="#94A3B8" size={16} />
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`text-xs text-slate-400 font-medium`}>Arrival</Text>
                  <Text style={tw`text-sm font-bold text-slate-700`}>{bus.arrivalTime || '07:12 AM'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={tw`bg-[#0D6EFD] py-3.5 rounded-2xl items-center flex-row justify-center shadow-md shadow-blue-500/20`}
                onPress={() => navigation.navigate('ConfirmBooking', { bus, startStop: startStop || bus.startStop, endStop: endStop || bus.endStop })}
              >
                <Bus color="#FFFFFF" size={18} style={tw`mr-2`} />
                <Text style={tw`text-white font-bold text-base`}>Book Ticket</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : hasSearched ? (
        <View style={tw`flex-1 justify-center items-center p-6`}>
          <Text style={tw`text-slate-400 text-sm font-semibold`}>No direct buses found for selected stops.</Text>
        </View>
      ) : (
        <View style={tw`flex-1 justify-center items-center p-6`}>
          <Text style={tw`text-slate-400 text-sm font-semibold`}>Enter departure & destination stops above to view schedules.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
