import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';


const STOPS = [
  'AIR FORCE',
  'SELECT DESTINATION',
  'GORAKHPUR',
  'PADRAUNA',
  'MVP COLONY',
  'VIZIANAGARAM',
  'RTC COMPLEX',
  'MADHURAWADA',
];

export default function TicketsScreen({ onNavigate }: { onNavigate?: (screen: string, data?: any) => void }) {

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [womenCount, setWomenCount] = useState(0);

  // Base Fares
  const FARE_ADULT = 25;
  const FARE_CHILD = 15;
  const FARE_WOMEN = 25;

  const totalPassengers = adultCount + childCount + womenCount;
  const totalFare = (adultCount * FARE_ADULT) + (childCount * FARE_CHILD) + (womenCount * FARE_WOMEN);
  const [boarding, setBoarding] = useState('AIR FORCE');
  const [alighting, setAlighting] = useState('SELECT DESTINATION');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'boarding' | 'alighting' | 'depo'>('boarding');
  const [depoStatus, setDepoStatus] = useState('Gorakhpur → Padrauna');

  const openStopSelection = (type: 'boarding' | 'alighting' | 'depo') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectStop = (stop: string) => {
    if (modalType === 'boarding') {
      setBoarding(stop);
    } else if (modalType === 'alighting') {
      setAlighting(stop);
    } else if (modalType === 'depo') {
      setDepoStatus(stop);
    }
    setModalVisible(false);
  };

  const navigateTo = (screen: string, data?: any) => {
    if (onNavigate) {
      onNavigate(screen, data);
    } else if (router?.push) {
      router.push(`/${screen}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerMenuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
        <Text style={styles.headerTitle}>APSRTC</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>{boarding === 'SELECT DESTINATION' ? 'AIR FORCE' : boarding}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Id</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>2</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Route No.</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>4008</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bus Type</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>ORDINARY</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changeStageBtn} onPress={() => openStopSelection('depo')}>
            <Text style={styles.changeStageText}>DEPO STATUS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.destinationHeader}>
          <Text style={styles.destinationText}>{depoStatus}</Text>
        </View>

        <View style={styles.passengerCountRow}>
          <Text style={styles.countText}>Total Passenger <Text style={styles.countNumber}>42</Text></Text>
          <Text style={styles.countText}>Alighting Passenger <Text style={styles.countNumber}>4</Text></Text>
        </View>

        <View style={styles.cardBox}>
          <View style={styles.actionRow}>
            <View style={styles.actionColumn}>
              <Text style={styles.actionLabel}>Boarding</Text>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.actionBtnActive]}
                onPress={() => openStopSelection('boarding')}
              >
                <Text style={[styles.actionBtnText, styles.actionBtnTextActive]}>{boarding}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionColumn}>
              <Text style={styles.actionLabel}>Alighting</Text>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.actionBtnActive]}
                onPress={() => openStopSelection('alighting')}
              >
                <Text style={[styles.actionBtnText, styles.actionBtnTextActive]}>{alighting}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.cardBox}>
          <View style={styles.stepperContainer}>
            <View style={styles.stepperRow}>
              <Text style={styles.stepperLabel}>ADULT (₹{FARE_ADULT})</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity 
                  style={[styles.stepperBtn, adultCount <= 0 && styles.stepperBtnDisabled]} 
                  disabled={adultCount <= 0}
                  onPress={() => setAdultCount(prev => prev - 1)}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{adultCount}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setAdultCount(prev => prev + 1)}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.stepperRow}>
              <Text style={styles.stepperLabel}>CHILD (₹{FARE_CHILD})</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity 
                  style={[styles.stepperBtn, childCount <= 0 && styles.stepperBtnDisabled]} 
                  disabled={childCount <= 0}
                  onPress={() => setChildCount(prev => prev - 1)}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{childCount}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setChildCount(prev => prev + 1)}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.stepperRow}>
              <Text style={styles.stepperLabel}>WOMEN (₹{FARE_WOMEN})</Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity 
                  style={[styles.stepperBtn, womenCount <= 0 && styles.stepperBtnDisabled]} 
                  disabled={womenCount <= 0}
                  onPress={() => setWomenCount(prev => prev - 1)}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{womenCount}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setWomenCount(prev => prev + 1)}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Passengers:</Text>
              <Text style={styles.summaryValue}>{totalPassengers}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Fare:</Text>
              <Text style={styles.summaryFare}>₹{totalFare.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDetailsRow}>
              <Text style={styles.summaryDetailsText}>
                {adultCount > 0 ? `${adultCount} Adult ` : ''}
                {childCount > 0 ? `${childCount} Child ` : ''}
                {womenCount > 0 ? `${womenCount} Women ` : ''}
              </Text>
            </View>
          </View>
          <View style={[styles.luggageRow, { marginTop: 12 }]}>
            <Text style={styles.luggageLabel}>Luggage</Text>
            <TouchableOpacity style={styles.luggageInput}>
              <Text style={styles.luggageInputText}>Select Slab(0.0 KG)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.paymentContainer}>
          <View style={styles.paymentRowTop}>
            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payBtnText}>PAY BY CASH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payBtn} onPress={() => navigateTo('upi-pay')}>
              <Text style={styles.payBtnText}>PAY BY UPI</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.payBtn} 
            onPress={() => navigateTo('offline-pay', { 
              amount: totalFare, 
              journey: `${boarding} → ${alighting}`, 
              passengerType: `A:${adultCount},C:${childCount},W:${womenCount}` 
            })}
          >
            <Text style={styles.payBtnText}>PAY OFFLINE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Stop Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'depo' ? 'Select Depo Status' : `Select ${modalType === 'boarding' ? 'Boarding' : 'Alighting'} Stop`}
            </Text>
            <FlatList
              data={modalType === 'depo' ? ['Gorakhpur → Padrauna', 'Padrauna → Gorakhpur', 'Air Force → MVP Colony'] : STOPS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectStop(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  headerMenuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  routeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    width: 70,
    fontSize: 14,
    color: '#555',
  },
  infoSeparator: {
    width: 16,
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  changeStageBtn: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  changeStageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  destinationHeader: {
    alignItems: 'center',
    marginVertical: 12,
  },
  destinationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  passengerCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 14,
    color: '#555',
  },
  countNumber: {
    fontWeight: 'bold',
    color: '#333',
  },
  cardBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionColumn: {
    flex: 1,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    backgroundColor: '#FFFFFF',
  },
  actionBtnActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  passengerTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    backgroundColor: '#FFFFFF',
  },
  typeBtnActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  luggageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  luggageLabel: {
    flex: 0.4,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  luggageInput: {
    flex: 0.6,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  luggageInputText: {
    fontSize: 14,
    color: '#555',
  },
  paymentContainer: {
    marginTop: 8,
    gap: 16,
  },
  paymentRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  payBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  stepperContainer: {
    gap: 12,
    marginBottom: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#E0E0E0',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  summaryContainer: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryFare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5A623',
  },
  summaryDetailsRow: {
    marginTop: 4,
  },
  summaryDetailsText: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
});
