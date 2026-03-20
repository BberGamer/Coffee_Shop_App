import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import InputField from '../components/InputField';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setAddress(user?.address || '');
    setAvatar(user?.avatar || '');
    setAvatarLoadFailed(false);
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        name: name.trim(),
        address: address.trim(),
        avatar: avatar.trim()
      });
      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = name.trim().charAt(0).toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U';
  const avatarUrl = avatar.trim();
  const showAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>Manage your information and account settings</Text>

      <View style={styles.avatar}>
        {showAvatarImage ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            onError={() => setAvatarLoadFailed(true)}
          />
        ) : (
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <InputField
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || '-'}</Text>

        <InputField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Add your address"
          multiline
        />

        <InputField
          label="Avatar URL"
          value={avatar}
          onChangeText={(value) => {
            setAvatar(value);
            setAvatarLoadFailed(false);
          }}
          placeholder="https://example.com/avatar.jpg"
        />
      </View>

      <PrimaryButton title="Save Changes" onPress={handleSave} loading={saving} />
      <View style={styles.logoutWrap}>
        <PrimaryButton title="Logout" onPress={logout} />
      </View>
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
    borderColor: colors.primary,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%'
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
  logoutWrap: {
    marginTop: 12
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
