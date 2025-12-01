// import 'react-native-gesture-handler'; // react navigation gereksinimi  //TODO : buna hala ihtiyac var mi
import { AppRegistry } from 'react-native';
// import App from './App';
import AppMain from './src/AppMain';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppMain);
