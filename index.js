/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {addNotification} from './src/helper/store';


//Recommended to call here instead in useAppStartup 
//(for background it works there but for quit it doesn't)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('HERE ----- Message handled in the background!', remoteMessage);
  addNotification(remoteMessage);
});

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

if (Platform.OS == 'android') {
    require('intl');
    require('intl/locale-data/jsonp/en-IN');
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
