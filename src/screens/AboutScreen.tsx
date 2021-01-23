import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView} from 'react-native';
import ApiClient from "../services/client";
import { WeatherForecast } from '../services/client/Client';
import config from "../../config";

const AboutScreen = () => {
   const [forecast, setForecast] = React.useState<WeatherForecast[]>([]);

   React.useEffect(() => {
    ApiClient.weatherForecast()
        .then((response) => {
            setForecast(response);
        })
        .catch((ex) => {
            console.log(ex);
        })
   }, []);

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <Text>About!</Text>
          {forecast.map((item, index) => (
              <Text key={index}>{item.summary}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {},
});

export default AboutScreen;
