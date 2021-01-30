import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import RootApp from './src/index.web';

// Can remove at some point...
window.process = {};

AppRegistry.registerComponent('App', () => RootApp);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('react-app'),
});
