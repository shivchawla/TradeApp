import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import MarketStack from './marketStack';
import PortfolioStack from './marketStack';
import SettingStack from './settingStack';
import OrderStack from './orderStack';
import AuthStack from './authStack';

enableScreens()
const Tabs = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const Router = props => {

	const {isSignedIn} = props;

	const tabStack = () => {
	     return (
	        <Tabs.Navigator>
	          <Tabs.Screen name="Market" component={MarketStack} />
	          <Tabs.Screen name="Order" component={OrderStack} />
	          <Tabs.Screen name="Portfolio" component={PortfolioStack}/>
	        </Tabs.Navigator>
	     )
	}

	return (
	  <NavigationContainer>
	  	{isSignedIn ?
		     <Drawer.Navigation>
		        <Drawer.Screen name="Home" component={tabStack} />
		        <Drawer.Screen name="Settings" component={SettingStack} />
		     </Drawer.Navigation>
		    : 
		    <AuthStack />
	    }
	   </NavigationContainer>
	   )
}

export default Router;
