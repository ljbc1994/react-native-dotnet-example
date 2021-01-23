import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Button} from 'react-native';
import { useLinkTo } from '@react-navigation/native';

const HomeScreen = () => {
  const linkTo = useLinkTo();
    
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Step why hello there</Text>
            <Text style={styles.sectionDescription}>
              Edit <Text style={styles.highlight}>App.tsx</Text> to sdsds
            </Text>
          </View>
          <Button title="Go to About" onPress={() => linkTo('/About')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  body: {},
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
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default HomeScreen;
