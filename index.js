/**
 * @format
 */
import 'react-native-gesture-handler';
import './src/libs/match-media';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
