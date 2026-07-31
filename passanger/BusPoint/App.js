import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          {!splashFinished && (
            <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />
          )}
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
