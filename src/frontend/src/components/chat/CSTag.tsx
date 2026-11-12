import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const CSTag: React.FC = React.memo(() => {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>CS</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.slate100,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.navy,
  },
});
