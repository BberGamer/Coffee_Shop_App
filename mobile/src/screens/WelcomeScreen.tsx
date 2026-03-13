import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>☕</Text>
        <Text style={styles.title}>Moon Coffee</Text>
        <Text style={styles.subtitle}>EST. 2024</Text>
      </View>

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.heroTitle}>Let’s get started!</Text>
          <Text style={styles.heroText}>
            Sign in to access our menu, promotions and more.
          </Text>
        </View>
      </ImageBackground>

      <PrimaryButton title="Start" onPress={() => navigation.navigate('Login')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: 20,
    alignItems: 'center'
  },
  logo: {
    fontSize: 40
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginTop: 10
  },
  subtitle: {
    color: colors.textSoft,
    marginTop: 4
  },
  hero: {
    flex: 1,
    width: '100%',
    marginVertical: 24,
    justifyContent: 'flex-end'
  },
  heroImage: {
    borderRadius: 28
  },
  overlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 28
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800'
  },
  heroText: {
    color: '#fff',
    marginTop: 8,
    lineHeight: 22
  }
});
