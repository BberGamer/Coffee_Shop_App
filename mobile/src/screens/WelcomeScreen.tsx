import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80'
      }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.brandWrap}>
          <Text style={styles.brand}>MOON COFFEE</Text>
          <Text style={styles.caption}>Slow brews. Clean design. Better mornings.</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0f1f24'
  },
  backgroundImage: {
    opacity: 0.96
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 54,
    backgroundColor: 'rgba(6, 20, 26, 0.22)'
  },
  brandWrap: {
    alignItems: 'center'
  },
  brand: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.5
  },
  caption: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.84)',
    fontSize: 15
  }
});
