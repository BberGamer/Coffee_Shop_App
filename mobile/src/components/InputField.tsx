import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  multiline?: boolean;
};

export default function InputField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  multiline
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        style={[styles.input, multiline ? styles.multiline : null]}
        placeholderTextColor={colors.textSoft}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  }
});
