import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function SignupScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Confirm password does not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
    } catch (error: any) {
      Alert.alert('Register failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#3a4758" />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Set up your account and start ordering your favorite drinks.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#9aa6b2"
            style={styles.input}
          />

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
              placeholder="Create password"
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

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#9aa6b2"
              style={styles.passwordInput}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword((current) => !current)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#95a0ad"
              />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <PrimaryButton title="Create Account" onPress={onRegister} loading={loading} />
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign In</Text>
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
    marginTop: 42,
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
    maxWidth: 290
  },
  form: {
    marginTop: 34
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
    marginBottom: 20,
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
    marginBottom: 20,
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
  actions: {
    marginTop: 8
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
