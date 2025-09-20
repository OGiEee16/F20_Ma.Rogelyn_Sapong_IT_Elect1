import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CounterApp from './CounterApp';
import ColorChangerApp from './ColorChangerApp';

export default function App() {
  const [bgColor, setBgColor] = useState('#1c1c1c');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <CounterApp bgColor={bgColor} />
      <ColorChangerApp setBgColor={setBgColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});