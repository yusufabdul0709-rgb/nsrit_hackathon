import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ArrowLeft, MapPin, Bus, CalendarClock, Download } from 'lucide-react-native';
import tw from 'twrnc';

export default function TicketQRScreen({ route, navigation }) {
  const { ticket } = route.params;
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #0D6EFD; padding-bottom: 20px; margin-bottom: 30px; }
              .logo-text { font-size: 28px; font-weight: bold; color: #0D6EFD; margin: 0; }
              .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
              
              .ticket-box { border: 1px solid #ddd; border-radius: 12px; padding: 25px; margin-bottom: 30px; background-color: #fafafa; }
              .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
              .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
              .value { font-size: 16px; font-weight: bold; color: #222; }
              
              .fare-box { background-color: rgba(13, 110, 253, 0.1); padding: 15px; border-radius: 8px; text-align: right; margin-top: 20px; }
              .fare-label { font-size: 14px; color: #0D6EFD; font-weight: bold; }
              .fare-value { font-size: 24px; font-weight: bold; color: #0D6EFD; margin: 0; }
              
              .rules-section { margin-top: 40px; }
              .rules-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
              .rules-list { font-size: 12px; color: #555; line-height: 1.6; }
              
              .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #aaa; border-top: 1px dashed #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="logo-text">APSRTC SMART BUS</h1>
              <p class="subtitle">Official E-Ticket Document</p>
            </div>
            
            <div class="ticket-box">
              <div class="row">
                <div>
                  <div class="label">Passenger Name</div>
                  <div class="value">${ticket.passengerName || 'Passenger'}</div>
                </div>
                <div>
                  <div class="label">Phone</div>
                  <div class="value">${ticket.passengerPhone || 'N/A'}</div>
                </div>
              </div>
              
              <div class="row">
                <div>
                  <div class="label">From</div>
                  <div class="value">${ticket.trip?.route?.startStop || ticket.startStop || 'Start'}</div>
                </div>
                <div>
                  <div class="label">To</div>
                  <div class="value">${ticket.trip?.route?.endStop || ticket.endStop || 'End'}</div>
                </div>
              </div>

              <div class="row">
                <div>
                  <div class="label">Ticket ID</div>
                  <div class="value">${ticket.id}</div>
                </div>
                <div>
                  <div class="label">Status</div>
                  <div class="value">${ticket.status}</div>
                </div>
              </div>
              
              <div class="row">
                <div>
                  <div class="label">Date of Issue</div>
                  <div class="value">${new Date(ticket.createdAt || Date.now()).toLocaleString()}</div>
                </div>
              </div>

              <div class="fare-box">
                <span class="fare-label">Total Fare Paid:</span>
                <span class="fare-value">₹${ticket.amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div class="rules-section">
              <div class="rules-title">Rules & Restrictions</div>
              <ul class="rules-list">
                <li>This E-Ticket is valid only for the journey and date specified.</li>
                <li>Please produce this ticket (digital or printed) along with a valid Photo ID upon request by the conductor.</li>
                <li>Luggage policy applies as per APSRTC standard regulations.</li>
                <li>Tickets are non-transferable.</li>
                <li>For support or grievances, contact APSRTC toll-free helpline at 1800-200-4599.</li>
              </ul>
            </div>

            <div class="footer">
              Generated via APSRTC Smart Bus Platform (Offline Mode)<br/>
              Document Ref: ${ticket.qrData}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      } else {
        Alert.alert('Saved', `Document saved to ${uri}`);
      }
    } catch (error) {
      console.log('PDF Gen error', error);
      Alert.alert('Error', 'Failed to generate offline document');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <View style={tw`flex-row items-center justify-between px-5 pt-12 pb-4 bg-slate-50`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
          <ArrowLeft color="#202124" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-slate-800`}>Your Ticket</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView contentContainerStyle={tw`p-5 items-center pb-12`} showsVerticalScrollIndicator={false}>
        <View style={tw`bg-white rounded-3xl w-full shadow-sm overflow-hidden mb-6 border border-slate-100`}>
          {/* QR Code Section */}
          <View style={tw`p-7 items-center bg-white`}>
            <QRCode
              value={ticket.qrData}
              size={200}
              color="#202124"
              backgroundColor="white"
            />
            <Text style={tw`mt-4 text-sm text-slate-500 font-semibold tracking-wider`}>ID: {ticket.id} • {ticket.status}</Text>
          </View>

          {/* Dotted Line Divider */}
          <View style={tw`flex-row items-center h-10 bg-white`}>
            <View style={tw`w-10 h-10 rounded-full bg-slate-50 -ml-5`} />
            <View style={tw`flex-1 h-[1px] border border-dashed border-slate-200 mx-2.5`} />
            <View style={tw`w-10 h-10 rounded-full bg-slate-50 -mr-5`} />
          </View>

          {/* Trip Details Section */}
          <View style={tw`p-6 bg-white`}>
            <View style={tw`flex-row items-center mb-5`}>
              <MapPin color="#0D6EFD" size={20} />
              <View style={tw`ml-4`}>
                <Text style={tw`text-xs text-slate-500 mb-1`}>Journey</Text>
                <Text style={tw`text-base font-bold text-slate-800`}>
                  {ticket.trip?.route?.startStop || ticket.startStop || 'Start'} to {ticket.trip?.route?.endStop || ticket.endStop || 'End'}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center mb-5`}>
              <Bus color="#64748B" size={20} />
              <View style={tw`ml-4`}>
                <Text style={tw`text-xs text-slate-500 mb-1`}>Bus Number</Text>
                <Text style={tw`text-base font-bold text-slate-800`}>{ticket.trip?.vehicle?.busNumber || 'APSRTC Express'}</Text>
              </View>
            </View>

            <View style={tw`flex-row items-center mb-5`}>
              <CalendarClock color="#0D6EFD" size={20} />
              <View style={tw`ml-4`}>
                <Text style={tw`text-xs text-slate-500 mb-1`}>Date & Time</Text>
                <Text style={tw`text-base font-bold text-slate-800`}>{new Date(ticket.createdAt || Date.now()).toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={tw`flex-row justify-between items-center bg-blue-50/80 p-5`}>
            <Text style={tw`text-base color-[#0D6EFD] font-semibold`}>Total Paid</Text>
            <Text style={tw`text-2xl font-bold text-[#0D6EFD]`}>₹{ticket.amount?.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={tw`bg-[#0D6EFD] flex-row w-full py-4 rounded-2xl justify-center items-center`} 
          onPress={generatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Download color="#FFFFFF" size={20} style={tw`mr-2`} />
              <Text style={tw`text-white text-base font-bold`}>Save Offline Document</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={tw`mt-5 text-sm text-slate-500 text-center px-5`}>
          Show this QR code to the conductor when boarding the bus.
        </Text>
      </ScrollView>
    </View>
  );
}
