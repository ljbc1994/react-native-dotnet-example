import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView} from 'react-native';

const LoginScreen = () => {

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <Text>Log in to your account!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  body: {},
});

export default LoginScreen;
