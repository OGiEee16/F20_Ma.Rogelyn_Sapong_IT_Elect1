import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function ColorChangerApp({ setBgColor }) {
  return (
    <View style={styles.buttonRow}>
      <View style={styles.buttonWrapper}>
        <Button title="White Mode" onPress={() => setBgColor('White')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Light Green" onPress={() => setBgColor('#90EE90')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Light Blue" onPress={() => setBgColor('#ADD8E6')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonWrapper: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
});