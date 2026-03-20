import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.logo}>☕</Text>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
      </View>

      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />

      <PrimaryButton title="Log In" onPress={onLogin} loading={loading} />

      <Pressable onPress={() => navigation.navigate('Signup')} style={styles.footer}>
        <Text style={styles.footerText}>
          Don’t have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24
  },
  logo: {
    fontSize: 40
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12
  },
  subtitle: {
    color: colors.textSoft,
    marginTop: 8
  },
  footer: {
    marginTop: 24,
    alignItems: 'center'
  },
  footerText: {
    color: colors.textSoft
  },
  link: {
    color: colors.primary,
    fontWeight: '700'
  }
});
