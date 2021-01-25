import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Platform} from 'react-native';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import { useMediaQuery } from 'react-responsive';
import Button from '../components/Button';
import UserForm from '../components/forms/UserForm';
import { useSelector } from "react-redux";


const HomeScreen = () => {
  const linkTo = useLinkTo();
  const navigation = useNavigation();

  const user = useSelector(state => state.user.user?.email); 

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

            <Text>Logged in email is {user}</Text>

            <UserForm />

            <Button onPress={() => linkTo('/about')}>
              Go here now!  
            </Button>
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
