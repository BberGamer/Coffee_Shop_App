import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const slides = [
  {
    title: 'Start Your Day With Moon Coffee',
    description: 'Discover handcrafted drinks and calm moments made for your daily rhythm.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Follow Fresh Brews And New Drops',
    description: 'See featured drinks, seasonal specials and coffee picks curated for you.',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Order Smoothly In Just A Few Taps',
    description: 'Choose your size, place an order fast and keep track of everything in one place.',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const activeSlide = slides[index];
  const isLastSlide = index === slides.length - 1;

  const goNext = () => {
    if (isLastSlide) {
      navigation.replace('Login');
      return;
    }

    setIndex((current) => current + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backgroundOrbLarge} />
      <View style={styles.backgroundOrbSmall} />
      <View style={styles.dotTopLeft} />
      <View style={styles.dotCenterRight} />
      <View style={styles.dotBottomRight} />

      <View style={styles.container}>
        <View style={styles.imageWrap}>
          <Text style={styles.watermark}>MOON</Text>
          <Image source={{ uri: activeSlide.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{activeSlide.title}</Text>
          <Text style={styles.description}>{activeSlide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, slideIndex) => (
              <View
                key={slideIndex}
                style={[
                  styles.paginationDot,
                  slideIndex === index ? styles.paginationDotActive : null
                ]}
              />
            ))}
          </View>

          <Pressable style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 24
  },
  backgroundOrbLarge: {
    position: 'absolute',
    top: -90,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#e8f1fb'
  },
  backgroundOrbSmall: {
    position: 'absolute',
    top: -20,
    right: 28,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fbff'
  },
  dotTopLeft: {
    position: 'absolute',
    top: 110,
    left: 38,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8ec2ff'
  },
  dotCenterRight: {
    position: 'absolute',
    top: 320,
    right: 54,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5ca2ef'
  },
  dotBottomRight: {
    position: 'absolute',
    top: 420,
    right: 22,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8ec2ff'
  },
  imageWrap: {
    marginTop: 38,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 330
  },
  watermark: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 78,
    fontWeight: '800',
    letterSpacing: 6,
    color: '#edf1f6'
  },
  image: {
    width: '100%',
    height: 270,
    borderRadius: 32,
    resizeMode: 'cover'
  },
  content: {
    marginTop: 18
  },
  title: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    color: '#243142'
  },
  description: {
    marginTop: 14,
    color: '#7d8998',
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 320
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d8dee6',
    marginRight: 8
  },
  paginationDotActive: {
    width: 28,
    backgroundColor: colors.primary
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    minWidth: 132,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
