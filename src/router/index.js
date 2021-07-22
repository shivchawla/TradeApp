import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/FontAwesome';

import Market from '../screens/market';
import ChooseStock from '../screens/order/chooseStock';
import PendingOrders from '../screens/order/pendingOrders';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings'

import innerScreens from './commonStack';

enableScreens();
const Tabs = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const homeTabs = () => {
     return (
        <Tabs.Navigator>
          <Tabs.Screen name="Market" component={Market} />
          {/*<Tabs.Screen name="ChooseStock" component={ChooseStock}/>*/}
          <Tabs.Screen name="PendingOrders" component={PendingOrders} />

          <Tabs.Screen name="Portfolio" component={Portfolio} />
        </Tabs.Navigator>
     )
}

// const drawerNav = () => {
// 	return (
// 		<Drawer.Navigator screenOptions={{headerShown: false}}>
// 	        <Drawer.Screen name="Home" component={homeTabs} />
// 	        <Drawer.Screen name="Settings" component={Settings} />
// 	     </Drawer.Navigator>
//     ); 
// }

const Router = (props) => {

	const {isSignedIn = true} = props;

	return (
	  <NavigationContainer>
	  	{isSignedIn ?
		     <Stack.Navigator screenOptions={{headerShown: false}}>
		        <Stack.Screen name="Home" component={homeTabs} />
		        {innerScreens(Stack)}
		     </Stack.Navigator>
		    : 
		    <AuthStack />
	    }
	   </NavigationContainer>
   );
}

export default Router;
