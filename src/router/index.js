import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {useColorScheme} from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth, AuthProvider } from '../helper';
import { ThemeProvider } from  '../theme';

// import { AppDarkTheme, AppDefaultTheme } from '../theme';


import Market from '../screens/market';
// import ChooseStock from '../screens/order/chooseStock';
import OrdersTrades from '../screens/order/ordersTrades';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings'
// import SignUp from '../screens/auth/signUp'
// import SignIn from '../screens/auth/signIn'

import AuthStack from './auth';
import OnboardStack from './onboard';

import innerScreens from './common';

enableScreens();
const Tabs = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const marketScreenOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="stats-chart" color={color} size={size} />
  ),
}

const portfolioScreenOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="pie-chart" color={color} size={size} />
  ),
}

const homeTabs = () => {
     return (
        <Tabs.Navigator tabBarOptions={{showLabel: false, activeTintColor:'yellow'}}>
          {/*<Tabs.Screen name="SignIn" component={SignIn} />*/}
          <Tabs.Screen name="Market" component={Market} options={marketScreenOptions}/>
          {/*<Tabs.Screen name="ChooseStock" component={ChooseStock}/>*/}
          {/*<Tabs.Screen name="OrdersTrades" component={OrdersTrades} />*/}

          <Tabs.Screen name="Portfolio" component={Portfolio} options={portfolioScreenOptions}/>
        </Tabs.Navigator>
     )
}

const TradingStack = () => {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="Home" component={homeTabs} />
	        {innerScreens(Stack)}
		</Stack.Navigator>
     )
}

const Routes = () => {
	const {currentUser, userAccount, brokerageAccount, isErrorUser, isErrorAccount, isErrorBrokerage} = useAuth(); 
	
	// console.log("Current User");
	// console.log(currentUser);

	// console.log("User Account");
	// console.log(userAccount);

	//This is covoluted logic
	//Because User Auth is fetching all data upto brokerage Data
	//But the hook to fetch data are pseudo conditional
	//Hence we have to wait for one of the steps to fail or till we get Brokerage Data to proceed

	const isLoading = !isErrorUser && !isErrorAccount && !isErrorBrokerage && !!!brokerageAccount?.data;

	// console.log("Is Loading");
	// console.log(isLoading);

	// console.log("isErrorUser");
	// console.log(!isErrorUser);

	// console.log("isErrorAccount");
	// console.log(!isErrorAccount);

	
	// console.log("isErrorBrokerage");
	// console.log(!isErrorBrokerage);

	// const scheme = useColorScheme();
	// console.log("Scheme");
	// console.log(scheme);


	return (
		// <>
		// {isLoading ? 
		// 	<Text style={{color: 'white'}}>Loading...</Text>
		// 	:	
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				{/*{!!currentUser?.user && !!brokerageAccount && */}
					<Stack.Screen name="Trading" component={TradingStack} />
				{/*}*/}
				{/*{!!currentUser?.user ?
					 <Stack.Screen name="Onboard" component={OnboardStack} />
					: <Stack.Screen name="Auth" component={AuthStack} />
				}*/}
			</Stack.Navigator>
	   </NavigationContainer>
	// }</>
	)
}


const Router = (props) => {

	return (
		<ThemeProvider>
			<AuthProvider>
				<Routes/>
		   </AuthProvider>
	   </ThemeProvider>
   );
}

export default Router;
