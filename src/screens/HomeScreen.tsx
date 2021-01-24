import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Button, Platform} from 'react-native';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import { useMediaQuery } from 'react-responsive';

const HomeScreen = () => {
  const linkTo = useLinkTo();
  const navigation = useNavigation();

  const isDesktop = useMediaQuery({
      query: '(min-device-width: 1224px)',
  });

  const isMobile = useMediaQuery({
    query: '(max-device-width: 1224px)',
  });

  return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            {isDesktop && <Text>You are on desktop</Text>}
            {isMobile && <Text>You are on mobile</Text>}

            {!(Platform.OS === 'web') && <Button title="Login" onPress={() => linkTo('/login')}>Login</Button>}

            <Text style={styles.sectionTitle}>Step why hello there</Text>
            <Text style={styles.sectionDescription}>
              Edit <Text style={styles.highlight}>App.tsx</Text> to sdsds
            </Text>
            <Button title="Go to About" onPress={() => linkTo('/about')} />
          </View>
        </View>
      </ScrollView>
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
