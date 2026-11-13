import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface SnackbarProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  onDismiss,
  duration = 4000,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    backgroundColor: colors.navy,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 999,
    elevation: 4,
  },
  text: {
    color: colors.white,
    fontSize: 13,
  },
});