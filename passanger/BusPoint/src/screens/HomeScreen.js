import React, { useRef, useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Platform, TextInput, Animated } from 'react-native';
import LiveTrackingCard from '../components/LiveTrackingCard';
import {
  Bell, MapPin, Wallet, Search,
  Ticket, Bus, QrCode, Clock, Map as MapIcon,
  Gift, Compass, Navigation, History, Shield,
  ArrowRight, Star, Bot, ArrowRightLeft, Check
} from 'lucide-react-native';
import tw from 'twrnc';
import { fetchPlaceSuggestions } from '../services/mapboxService';

const Header = () => (
  <View style={tw`flex-row justify-between items-center mb-6`}>
    <View style={tw`flex-row items-center`}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?u=jay' }}
        style={tw`w-12 h-12 rounded-full mr-3`}
      />
      <View style={tw`justify-center`}>
        <Text style={tw`text-sm font-medium text-white/80`}>Good Morning,</Text>
        <Text style={tw`text-xl font-bold text-white`}>Yusuf👋</Text>
      </View>
    </View>

    <View style={tw`flex-row items-center gap-3`}>
      <View style={tw`flex-row items-center bg-white/15 px-2.5 py-1.5 rounded-full`}>
        <MapPin color="#FFFFFF" size={14} />
        <Text style={tw`text-xs font-semibold text-white ml-1`}>Sontyam</Text>
      </View>
      <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-white/15 justify-center items-center`}>
        <Wallet color="#FFFFFF" size={22} />
      </TouchableOpacity>
      <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-white/15 justify-center items-center relative`}>
        <Bell color="#FFFFFF" size={22} />
        <View style={tw`absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white`} />
      </TouchableOpacity>
    </View>
  </View>
);

const HeroCard = ({ navigation }) => (
  <View style={tw`py-4 mb-4 relative overflow-hidden`}>
    <View style={tw`flex-row justify-between items-center mb-8 z-10`}>
      <View style={tw`flex-1`}>
        <Text style={tw`text-3xl font-bold text-white leading-9`}>Smarter.</Text>
        <Text style={tw`text-3xl font-bold text-white leading-9`}>Ride Better.</Text>
        <Text style={tw`text-3xl font-bold text-white/70 leading-9`}>Anywhere.</Text>
      </View>
      <View style={tw`w-35 h-28 ml-4 justify-center items-end`}>
        <Bus color={'rgba(255,255,255,0.25)'} size={100} strokeWidth={1} />
      </View>
    </View>

    <View style={tw`flex-row gap-3 z-10`}>
      <TouchableOpacity 
        style={tw`flex-row items-center bg-white px-4 py-3 rounded-2xl flex-1 justify-center`} 
        onPress={() => navigation.navigate('Journey')}
      >
        <Ticket color="#0D6EFD" size={20} />
        <Text style={tw`text-slate-800 font-semibold text-sm ml-2`}>Buy Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={tw`flex-row items-center bg-white px-4 py-3 rounded-2xl flex-1 justify-center`} 
        onPress={() => navigation.navigate('LiveTracking')}
      >
        <Navigation color="#0D6EFD" size={20} />
        <Text style={tw`text-slate-800 font-semibold text-sm ml-2`}>Live Tracking</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SmartSearch = ({ navigation }) => {
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // 'from' | 'to' | null

  useEffect(() => {
    if (startStop && activeInput === 'from') {
      fetchPlaceSuggestions(startStop).then(setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  }, [startStop, activeInput]);

  useEffect(() => {
    if (endStop && activeInput === 'to') {
      fetchPlaceSuggestions(endStop).then(setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  }, [endStop, activeInput]);

  const handleSearch = () => {
    navigation.navigate('Journey', { initialStart: startStop, initialEnd: endStop });
  };

  return (
    <View style={tw`bg-white rounded-3xl p-4 mb-5 shadow-sm border border-slate-100`}>
      {/* Locations & Swap */}
      <View style={tw`relative mb-4 z-20`}>
        
        {/* FROM INPUT */}
        <View style={tw`flex-row items-center py-3 relative`}>
          <Navigation color="#0D6EFD" size={20} />
          <TextInput
            style={tw`flex-1 ml-4 text-base text-slate-800 font-semibold`}
            placeholder="From (e.g. Visakhapatnam, RTC Complex)"
            placeholderTextColor="#94A3B8"
            value={startStop}
            onFocus={() => setActiveInput('from')}
            onChangeText={(text) => {
              setStartStop(text);
              setActiveInput('from');
            }}
          />
        </View>

        {/* FROM SUGGESTIONS DROPDOWN */}
        {activeInput === 'from' && fromSuggestions.length > 0 && (
          <View style={tw`bg-white rounded-2xl p-2 border border-slate-200 shadow-md mb-2 z-50`}>
            {fromSuggestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={tw`flex-row items-center p-3 border-b border-slate-100 last:border-b-0`}
                onPress={() => {
                  setStartStop(item.name);
                  setFromSuggestions([]);
                  setActiveInput(null);
                }}
              >
                <MapPin color="#0D6EFD" size={16} />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`text-xs font-bold text-slate-900`}>{item.name}</Text>
                  <Text style={tw`text-[10px] text-slate-500`} numberOfLines={1}>{item.place_name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={tw`h-[1px] bg-slate-200 ml-9`} />

        {/* TO INPUT */}
        <View style={tw`flex-row items-center py-3 relative`}>
          <MapPin color="#EF4444" size={20} />
          <TextInput
            style={tw`flex-1 ml-4 text-base text-slate-800 font-semibold`}
            placeholder="To (e.g. Anakapalle, Gajuwaka)"
            placeholderTextColor="#94A3B8"
            value={endStop}
            onFocus={() => setActiveInput('to')}
            onChangeText={(text) => {
              setEndStop(text);
              setActiveInput('to');
            }}
          />
        </View>

        {/* TO SUGGESTIONS DROPDOWN */}
        {activeInput === 'to' && toSuggestions.length > 0 && (
          <View style={tw`bg-white rounded-2xl p-2 border border-slate-200 shadow-md mb-2 z-50`}>
            {toSuggestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={tw`flex-row items-center p-3 border-b border-slate-100 last:border-b-0`}
                onPress={() => {
                  setEndStop(item.name);
                  setToSuggestions([]);
                  setActiveInput(null);
                }}
              >
                <MapPin color="#EF4444" size={16} />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`text-xs font-bold text-slate-900`}>{item.name}</Text>
                  <Text style={tw`text-[10px] text-slate-500`} numberOfLines={1}>{item.place_name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={tw`absolute right-2.5 top-[30px] w-9 h-9 rounded-full bg-white border border-slate-200 justify-center items-center z-10 shadow-sm`} 
          onPress={() => {
            const temp = startStop;
            setStartStop(endStop);
            setEndStop(temp);
          }}
        >
          <ArrowRightLeft color="#5F6368" size={18} style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <View style={tw`flex-row items-center border-t border-b border-slate-200 py-3 mb-4`}>
        <View style={tw`items-center pr-4 border-r border-slate-200`}>
          <Clock color="#5F6368" size={16} />
          <Text style={tw`text-xs text-slate-500 font-bold mt-1`}>AUG 2026</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pl-4 gap-3`}>
          <TouchableOpacity style={tw`items-center justify-center px-3 py-2 rounded-lg bg-[#0D6EFD]`}>
            <Text style={tw`text-[10px] text-blue-100 font-bold`}>Today</Text>
            <Text style={tw`text-lg font-bold text-white`}>1</Text>
            <Text style={tw`text-xs text-white`}>Sat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center justify-center px-3 py-2 rounded-lg bg-slate-100`}>
            <Text style={tw`text-lg font-bold text-slate-800`}>2</Text>
            <Text style={tw`text-xs text-slate-500`}>Sun</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center justify-center px-3 py-2 rounded-lg bg-slate-100`}>
            <Text style={tw`text-lg font-bold text-slate-800`}>3</Text>
            <Text style={tw`text-xs text-slate-500`}>Mon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center justify-center px-3 py-2 rounded-lg bg-slate-100`}>
            <Text style={tw`text-lg font-bold text-slate-800`}>4</Text>
            <Text style={tw`text-xs text-slate-500`}>Tue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Search Button */}
      <TouchableOpacity 
        style={tw`bg-[#0D6EFD] py-4 rounded-2xl items-center flex-row justify-center mx-0 mt-2`} 
        onPress={handleSearch}
      >
        <Search color="#FFFFFF" size={20} />
        <Text style={tw`text-white text-lg font-bold ml-2`}>Search Buses</Text>
      </TouchableOpacity>
    </View>
  );
};

const QuickActions = ({ navigation }) => {
  const handleAction = (label) => {
    if (label === 'Buy Ticket' || label === 'Planner') {
      navigation.navigate('Journey');
    } else if (label === 'Live Tracking' || label === 'Nearby Stops') {
      navigation.navigate('LiveTracking');
    } else if (label === 'Scan QR') {
      navigation.navigate('ScanQR');
    } else if (label === 'Wallet') {
      navigation.navigate('Wallet');
    } else if (label === 'Support') {
      navigation.navigate('Feedback');
    }
  };

  const actions = [
    { icon: Ticket, label: 'Buy Ticket' },
    { icon: Navigation, label: 'Live Tracking' },
    { icon: Gift, label: 'Bus Pass' },
    { icon: QrCode, label: 'Scan QR' },
    { icon: MapPin, label: 'Nearby Stops' },
    { icon: Compass, label: 'Planner' },
    { icon: Wallet, label: 'Wallet' },
    { icon: History, label: 'History' },
    { icon: Star, label: 'Rewards' },
    { icon: Shield, label: 'Support' },
  ];

  return (
    <View style={tw`flex-row flex-wrap justify-between mb-6`}>
      {actions.map((action, index) => (
        <TouchableOpacity 
          key={index} 
          style={tw`w-[18%] items-center mb-5`} 
          onPress={() => handleAction(action.label)}
        >
          <View style={tw`w-14 h-14 rounded-2xl bg-white justify-center items-center mb-2 border border-slate-200 shadow-sm`}>
            <action.icon color="#0D6EFD" size={24} strokeWidth={1.5} />
          </View>
          <Text style={tw`text-[11px] font-semibold text-slate-800 text-center`}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RecentJourneys = ({ navigation }) => (
  <View style={tw`mb-6`}>
    <View style={tw`flex-row justify-between items-center mb-4`}>
      <Text style={tw`text-xl font-bold text-slate-800`}>Recent Journeys</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Journey')}>
        <Text style={tw`text-sm font-semibold text-[#0D6EFD]`}>See All</Text>
      </TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-4`}>
      <View style={tw`w-65 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm`}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View>
            <Text style={tw`text-base font-bold text-slate-800 mb-1`}>RTC Complex to Anakapalle</Text>
            <Text style={tw`text-xs text-slate-500 font-medium`}>Today, 09:30 AM</Text>
          </View>
          <Text style={tw`text-base font-bold text-[#0D6EFD]`}>₹25</Text>
        </View>
        <TouchableOpacity style={tw`flex-row items-center justify-center bg-slate-50 py-2.5 rounded-xl`} onPress={() => navigation.navigate('Journey')}>
          <Text style={tw`text-xs font-semibold text-[#0D6EFD] mr-1.5`}>Rebook Ticket</Text>
          <ArrowRight color="#0D6EFD" size={16} />
        </TouchableOpacity>
      </View>

      <View style={tw`w-65 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm`}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View>
            <Text style={tw`text-base font-bold text-slate-800 mb-1`}>Gajuwaka to Vizag</Text>
            <Text style={tw`text-xs text-slate-500 font-medium`}>Yesterday, 06:15 PM</Text>
          </View>
          <Text style={tw`text-base font-bold text-[#0D6EFD]`}>₹40</Text>
        </View>
        <TouchableOpacity style={tw`flex-row items-center justify-center bg-slate-50 py-2.5 rounded-xl`} onPress={() => navigation.navigate('Journey')}>
          <Text style={tw`text-xs font-semibold text-[#0D6EFD] mr-1.5`}>Rebook Ticket</Text>
          <ArrowRight color="#0D6EFD" size={16} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

export default function HomeScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const fabTranslateY = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <StatusBar barStyle="light-content" backgroundColor="#0D6EFD" />
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={tw`pb-25`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={tw`bg-[#0D6EFD] px-5 ${Platform.OS === 'android' ? 'pt-12' : 'pt-5'} pb-10 rounded-b-[32px]`}>
          <Header />
          <HeroCard navigation={navigation} />
        </View>
        <View style={tw`px-5 -mt-8`}>
          <SmartSearch navigation={navigation} />
          <QuickActions navigation={navigation} />
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-slate-800`}>Live Journey Status</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LiveTracking')}>
              <Text style={tw`text-sm font-semibold text-[#0D6EFD]`}>View All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('LiveTracking')}>
            <LiveTrackingCard />
          </TouchableOpacity>
          <RecentJourneys navigation={navigation} />
        </View>
      </Animated.ScrollView>

      {/* AI Assistant FAB */}
      <Animated.View style={[tw`absolute bottom-6 right-6 z-50`, { transform: [{ translateY: fabTranslateY }] }]}>
        <TouchableOpacity 
          style={tw`w-15 h-15 rounded-full bg-purple-600 justify-center items-center shadow-lg`} 
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <Bot color="#FFFFFF" size={28} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
