import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Star, Bus, Send } from 'lucide-react-native';
import tw from 'twrnc';

export default function FeedbackScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please provide a star rating for your journey.');
      return;
    }
    
    setTimeout(() => {
      Alert.alert('Thank You!', 'Your feedback helps us improve APSRTC services.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 500);
  };

  const renderStars = (currentRating, setter) => {
    return (
      <View style={tw`flex-row justify-center`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setter(star)} style={tw`p-1 mx-1`}>
            <Star 
              color={star <= currentRating ? '#FFD700' : '#E2E8F0'} 
              fill={star <= currentRating ? '#FFD700' : 'transparent'} 
              size={32} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-slate-50`} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={tw`flex-row items-center justify-between px-5 pt-12 pb-4 bg-slate-50`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
          <ArrowLeft color="#202124" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-slate-800`}>Rate Your Journey</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView contentContainerStyle={tw`p-5`}>
        <View style={tw`items-center my-6`}>
          <View style={tw`w-20 h-20 rounded-full bg-blue-100 justify-center items-center mb-4`}>
            <Bus color="#0D6EFD" size={48} />
          </View>
          <Text style={tw`text-2xl font-bold text-slate-800 mb-1`}>How was your trip?</Text>
          <Text style={tw`text-sm font-medium text-slate-500`}>Visakhapatnam - Anakapalle</Text>
        </View>

        <View style={tw`bg-white p-5 rounded-2xl mb-4 items-center border border-slate-200`}>
          <Text style={tw`text-base font-semibold text-slate-800 mb-4`}>Overall Experience</Text>
          {renderStars(rating, setRating)}
        </View>

        <View style={tw`bg-white p-5 rounded-2xl mb-4 items-center border border-slate-200`}>
          <Text style={tw`text-base font-semibold text-slate-800 mb-4`}>Bus Cleanliness</Text>
          {renderStars(cleanliness, setCleanliness)}
        </View>

        <View style={tw`mt-2 mb-8`}>
          <Text style={tw`text-sm font-semibold text-slate-800 mb-2`}>Additional Comments (Optional)</Text>
          <TextInput
            style={tw`bg-white border border-slate-200 rounded-2xl p-4 text-base text-slate-800 min-h-[120px]`}
            multiline
            numberOfLines={4}
            placeholder="Tell us about the driver, AC, or any issues..."
            placeholderTextColor="#94A3B8"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={tw`bg-[#0D6EFD] flex-row justify-center items-center h-14 rounded-2xl mb-10`} onPress={handleSubmit}>
          <Send color="#FFFFFF" size={20} style={tw`mr-2`} />
          <Text style={tw`text-white text-base font-bold`}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
