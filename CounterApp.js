import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CounterApp({ bgColor }) {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: 'black' }]}>Counter App</Text>
      <Text style={[styles.count, { color: 'black' }]}>{count}</Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Decrement" onPress={() => setCount(count - 1)} />
        </View>
        <View style={{ width: 10 }} />
        <View style={styles.buttonWrapper}>
          <Button title="Increment" onPress={() => setCount(count + 1)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  count: {
    fontSize: 100,
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});