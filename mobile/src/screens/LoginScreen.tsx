import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Onboarding')}>
          <Ionicons name="chevron-back" size={18} color="#3a4758" />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Hello Again!</Text>
          <Text style={styles.subtitle}>Welcome back. Sign in to continue your coffee journey.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9aa6b2"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9aa6b2"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword((current) => !current)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#95a0ad"
              />
            </Pressable>
          </View>

          <Pressable style={styles.recoveryWrap}>
            <Text style={styles.recoveryText}>Forgot Password?</Text>
          </Pressable>

          <PrimaryButton title="Sign In" onPress={onLogin} loading={loading} />

          <View style={styles.secondaryButton}>
            <Ionicons name="logo-google" size={18} color="#4285F4" />
            <Text style={styles.secondaryText}>Sign in with Google</Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('Signup')} style={styles.footer}>
          <Text style={styles.footerText}>
            Do not have an account? <Text style={styles.footerLink}>Sign Up</Text>
          </Text>
        </Pressable>
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
    paddingHorizontal: 26,
    paddingTop: 10,
    paddingBottom: 28
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8ba0b7',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  header: {
    marginTop: 48,
    alignItems: 'center'
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#243142'
  },
  subtitle: {
    marginTop: 10,
    color: '#8b97a5',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280
  },
  form: {
    marginTop: 44
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d3a4b',
    marginBottom: 10
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#243142',
    marginBottom: 22,
    shadowColor: '#95a7ba',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: '#95a7ba',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    color: '#243142'
  },
  recoveryWrap: {
    alignSelf: 'flex-end',
    marginBottom: 26
  },
  recoveryText: {
    color: '#97a3b1',
    fontSize: 12
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  secondaryText: {
    color: '#243142',
    fontWeight: '600'
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center'
  },
  footerText: {
    color: '#8f9aa7'
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700'
  }
});
