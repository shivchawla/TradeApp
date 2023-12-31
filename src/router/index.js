import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthProvider, useAppStartup } from '../helper';
import { useTheme, ThemeProvider } from  '../theme';
import { WebsocketProvider } from  '../helper';

import { CustomTabBar } from '../components/common';

import Market from '../screens/market';
import History from '../screens/history';
import OrdersTrades from '../screens/order/ordersTrades';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings';
// import SignUp from '../screens/auth/signUp'
// import SignIn from '../screens/auth/signIn'

import AuthStack from './auth';
// import OnboardStack from './onboard';
import Onboard from '../screens/onboard'

import innerScreens from './common';

enableScreens();
const Tabs = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const homeTabs = () => {
		const {theme} = useTheme();
		const tabBarOptions = {
			showLabel: false, 
			activeTintColor:theme.tabTint, 
			style: {
				backgroundColor: theme.tabBackground,
			}};

		return (
		  <Tabs.Navigator {...{tabBarOptions}} tabBar={props => <CustomTabBar {...props} />}>
		    {/*<Tabs.Screen name="SignIn" component={SignIn} />*/}
		    <Tabs.Screen name="Portfolio" component={Portfolio} />
		    
		    {/*<Tabs.Screen name="ChooseStock" component={ChooseStock}/>*/}
		    {/*<Tabs.Screen name="OrdersTrades" component={OrdersTrades} />*/}
		  	<Tabs.Screen name="Market" component={Market} />
		  	{/*<Tabs.Screen name="History" component={History} />*/}
		    
		  </Tabs.Navigator>
		)
}

const TradingStack = () => {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="Home" component={homeTabs} />
      {innerScreens(Stack)}
	    <Stack.Screen name="Settings" component={Settings} />    
		</Stack.Navigator>
     )
}

const Routes = () => {
	
	const {isLoading, currentUser, brokerageAccount} = useAppStartup();

	// console.log("Current User");
	// console.log(currentUser);

	// console.log("User Account");
	// console.log(userAccount);

	//This is covoluted logic
	//Because User Auth is fetching all data upto brokerage Data
	//But the hook to fetch data are pseudo conditional
	//Hence we have to wait for one of the steps to fail or till we get Brokerage Data to proceed

	
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
		// 	<StyledText style={{color: 'white'}}>Loading...</StyledText>
		// 	:	
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				{!!currentUser?.user && !!brokerageAccount && 
					<Stack.Screen name="Trading" component={TradingStack} />
				}
				{!!currentUser?.user ?
					 <Stack.Screen name="Onboard" component={Onboard} />
					: <Stack.Screen name="Auth" component={AuthStack} />
				}
			</Stack.Navigator>
	   </NavigationContainer>
	// }</>
	)
}


const Router = (props) => {

	return (
		<WebsocketProvider>
			<ThemeProvider>
				<AuthProvider>
					<Routes/>
				</AuthProvider>
			</ThemeProvider>
		</WebsocketProvider>
   );
}

export default Router;
