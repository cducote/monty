import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // Animation values using standard Animated API
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(-180)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const textSlideY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start the animation sequence
    const startAnimation = () => {
      // Create animated sequence
      Animated.sequence([
        // Background fade in
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        
        // Parallel animations for main entrance
        Animated.parallel([
          // Circle expansion
          Animated.spring(circleScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: false,
          }),
          
          // Logo scale and rotation
          Animated.parallel([
            Animated.spring(logoScale, {
              toValue: 1,
              tension: 50,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.spring(logoRotation, {
              toValue: 0,
              tension: 50,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.timing(logoOpacity, {
              toValue: 1,
              duration: 800,
              delay: 200,
              useNativeDriver: false,
            }),
          ]),
          
          // Text slide up
          Animated.spring(textSlideY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            delay: 400,
            useNativeDriver: false,
          }),
        ]),
        
        // Hold for 2 seconds
        Animated.delay(2000),
        
        // Fade out
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(backgroundOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        onAnimationComplete();
      });
    };

    startAnimation();
  }, []);

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [-180, 0],
    outputRange: ['-180deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* Animated background */}
      <Animated.View 
        style={[
          styles.background, 
          { opacity: backgroundOpacity }
        ]} 
      />
      
      {/* Animated circle behind logo */}
      <Animated.View 
        style={[
          styles.circle, 
          { 
            transform: [{ scale: circleScale }],
          }
        ]} 
      />
      
      {/* Main logo container */}
      <View style={styles.logoContainer}>
        {/* Logo with animation */}
        <Animated.View 
          style={[
            styles.logoWrapper,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotationInterpolate },
              ],
              opacity: logoOpacity,
            }
          ]}
        >
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🐕</Text>
          </View>
        </Animated.View>
        
        {/* App name with animation */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textSlideY }],
              opacity: logoOpacity,
            }
          ]}
        >
          <Text style={styles.appName}>Monty</Text>
          <Text style={styles.tagline}>Inventory Assistant</Text>
        </Animated.View>
      </View>
      
      {/* Decorative elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  circle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 72,
    fontFamily: 'Modak-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 2,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dot1: {
    top: height * 0.2,
    left: width * 0.15,
  },
  dot2: {
    top: height * 0.7,
    right: width * 0.2,
  },
  dot3: {
    top: height * 0.3,
    right: width * 0.1,
  },
});
