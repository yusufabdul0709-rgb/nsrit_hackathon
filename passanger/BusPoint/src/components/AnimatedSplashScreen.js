import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, StatusBar, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="none">
      <StatusBar barStyle="light-content" backgroundColor="#004CFF" />
      <Animated.Image
        source={require('../../assets/splash.png')}
        style={[
          styles.splashImage,
          { transform: [{ scale: scaleAnim }] }
        ]}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#004CFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  splashImage: {
    width: width,
    height: height,
  },
});
