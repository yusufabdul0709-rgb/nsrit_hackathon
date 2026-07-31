import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Send, Bot, Sparkles } from 'lucide-react-native';
import { queryOfflineRAG } from '../utils/OfflineAI';
import { API_BASE_URL } from '../config/api';
import tw from 'twrnc';

export default function AIAssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! I am your Offline Smart Assistant ✨. Ask me anything about APSRTC rules, luggage, tickets, or refunds.', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: inputText.trim(), isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text })
      });
      const data = await response.json();
      
      const botMsg = { id: (Date.now() + 1).toString(), text: data.answer, isBot: true };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.warn("Backend AI failed, falling back to Offline RAG");
      const botResponse = queryOfflineRAG(userMsg.text);
      const botMsg = { id: (Date.now() + 1).toString(), text: botResponse, isBot: true };
      setMessages(prev => [...prev, botMsg]);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1 bg-slate-50`} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={tw`flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#0D6EFD]`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
          <Bot color="#FFFFFF" size={20} />
          <Text style={tw`text-lg font-bold text-white ml-2`}>Offline AI Assistant</Text>
        </View>
        <View style={tw`w-6`} />
      </View>

      <View style={tw`bg-blue-50 flex-row items-center justify-center py-2`}>
        <Sparkles color="#0D6EFD" size={14} />
        <Text style={tw`text-xs font-semibold text-[#0D6EFD] ml-1.5`}>RAG Engine Active (Offline Mode)</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={tw`flex-1 px-5 pt-5`}
        contentContainerStyle={tw`pb-5`}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={tw`flex-row mb-4 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end justify-end'}`}>
            {msg.isBot && (
              <View style={tw`w-7 h-7 rounded-full bg-blue-100 justify-center items-center mr-2 mt-1`}>
                <Bot color="#0D6EFD" size={16} />
              </View>
            )}
            <View style={tw`p-3.5 rounded-2xl ${msg.isBot ? 'bg-white rounded-tl-sm border border-slate-100' : 'bg-[#0D6EFD] rounded-tr-sm'}`}>
              <Text style={tw`text-sm leading-5 ${msg.isBot ? 'text-slate-800' : 'text-white'}`}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={tw`flex-row p-4 ${Platform.OS === 'ios' ? 'pb-8' : 'pb-4'} bg-white border-t border-slate-200`}>
        <TextInput
          style={tw`flex-1 h-12 bg-slate-50 rounded-full px-5 text-sm text-slate-800 border border-slate-200`}
          placeholder="Ask me a question..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={tw`w-12 h-12 rounded-full ${!inputText.trim() ? 'bg-slate-300' : 'bg-[#0D6EFD]'} justify-center items-center ml-3`} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
