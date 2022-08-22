/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

if (Platform.OS == 'android') {
    require('intl');
    require('intl/locale-data/jsonp/en-IN');
}

AppRegistry.registerComponent(appName, () => App);
