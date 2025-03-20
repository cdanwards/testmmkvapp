/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Create a new MMKV instance
export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'my-secure-key',
});

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [counter, setCounter] = useState(0);
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  // Load the counter value when the app starts
  useEffect(() => {
    const savedCounter = storage.getNumber('counter') || 0;
    setCounter(savedCounter);

    // Initial network status check
    NetInfo.fetch().then(setNetworkState);

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(setNetworkState);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Update counter and save to storage
  const incrementCounter = () => {
    const newValue = counter + 1;
    setCounter(newValue);
    storage.set('counter', newValue);
  };

  const resetCounter = () => {
    setCounter(0);
    storage.set('counter', 0);
  };

  const getNetworkStatusColor = () => {
    if (!networkState?.isConnected) {
      return 'red';
    }
    return networkState?.isInternetReachable ? 'green' : 'orange';
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Network Status">
            <View style={styles.networkContainer}>
              <View
                style={[
                  styles.statusDot,
                  {backgroundColor: getNetworkStatusColor()},
                ]}
              />
              <Text style={[styles.sectionDescription, {marginLeft: 10}]}>
                {networkState?.type || 'Unknown'}
                {'\n'}
                Connected: {networkState?.isConnected ? 'Yes' : 'No'}
                {networkState?.isInternetReachable === false
                  ? '\nNo Internet'
                  : ''}
              </Text>
            </View>
          </Section>

          <Section title="MMKV Storage Example">
            <Text style={[styles.sectionDescription, {marginBottom: 10}]}>
              Counter: {counter}
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Increment" onPress={incrementCounter} />
              <View style={styles.buttonSpacer} />
              <Button title="Reset" onPress={resetCounter} />
            </View>
          </Section>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 20,
  },
  networkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default App;
