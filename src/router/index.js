import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
// import { createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/FontAwesome';

import MarketStack from './marketStack';
import PortfolioStack from './marketStack';
import SettingStack from './settingStack';
import OrderStack from './orderStack';
import AuthStack from './authStack';

enableScreens();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const tabStack = () => {
     return (
        <Tabs.Navigator>
          <Tabs.Screen name="Market" component={MarketStack} />
          <Tabs.Screen name="Order" component={OrderStack} />
          <Tabs.Screen name="Portfolio" component={PortfolioStack} />
        </Tabs.Navigator>
     )
}

const Router = (props) => {

	const {isSignedIn = true} = props;

	// useEffect(() => {
	// 	console.log("In Use Effect - Router");
	// });

	return (
	  <NavigationContainer>
	  	{isSignedIn ?
		     <Drawer.Navigator>
		        <Drawer.Screen name="Home" component={tabStack} />
		        <Drawer.Screen name="Settings" component={SettingStack} />
		     </Drawer.Navigator>
		    : 
		    <AuthStack />
	    }
	   </NavigationContainer>
   );
}

export default Router;
