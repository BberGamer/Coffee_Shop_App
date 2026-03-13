import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>Manage your information and account settings</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      <PrimaryButton title="Logout" onPress={logout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSoft
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primaryDark
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24
  },
  label: {
    color: colors.textSoft,
    marginTop: 12
  },
  value: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 6
  }
});
