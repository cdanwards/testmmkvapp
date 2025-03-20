/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';

// Create a new MMKV instance
export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'my-secure-key',
});

function App(): React.JSX.Element {
  const [counter, setCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load the counter value when the app starts
  useEffect(() => {
    const savedCounter = storage.getNumber('counter') || 0;
    const savedTimestamp = storage.getString('timestamp') || '';
    setCounter(savedCounter);
    setLastUpdated(savedTimestamp);
  }, []);

  // Update counter and save to storage
  const incrementCounter = () => {
    const newValue = counter + 1;
    const timestamp = new Date().toISOString();

    setCounter(newValue);
    setLastUpdated(timestamp);

    storage.set('counter', newValue);
    storage.set('timestamp', timestamp);
  };

  const resetCounter = () => {
    const timestamp = new Date().toISOString();

    setCounter(0);
    setLastUpdated(timestamp);

    storage.set('counter', 0);
    storage.set('timestamp', timestamp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>MMKV Storage Example</Text>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Counter: {counter}</Text>

          {lastUpdated ? (
            <Text style={styles.timestamp}>
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Increment" onPress={incrementCounter} />
          <View style={styles.buttonSpacer} />
          <Button title="Reset" onPress={resetCounter} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  counterContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 30,
  },
  counterText: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 20,
  },
});

export default App;
