import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
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
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.logo}>☕</Text>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Sign up to get started and shop with us</Text>
      </View>

      <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter your full name" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Create password" />
      <InputField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm password" />

      <PrimaryButton title="Sign Up" onPress={onRegister} loading={loading} />

      <Pressable onPress={() => navigation.navigate('Login')} style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Log in</Text>
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
    marginTop: 8,
    textAlign: 'center'
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
