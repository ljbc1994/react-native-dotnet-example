/**
 * @format
 */
import 'react-native-gesture-handler';
import './src/libs/match-media';

import {AppRegistry} from 'react-native';
import RootApp from './src/index.native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => RootApp);
