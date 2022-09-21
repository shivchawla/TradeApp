import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NetInfo from "@react-native-community/netinfo";

import { AuthProvider, useAppStartup, useAuth, useBrokerageAccountData } from '../helper';
import { useTheme, useDimensions, useTypography, ThemeProvider, StyledText } from  '../theme';
import { WebsocketProvider, WatchlistProvider } from  '../helper';

import { CustomTabBar } from '../components/common';

import Splash from '../screens/splash';
import Home from '../screens/home';
import Market from '../screens/market';
import History from '../screens/history';
import OrdersTrades from '../screens/order/ordersTrades';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings';
import NoInternet from '../screens/errors/noInternet';
import Account from '../screens/account';

import AuthStack from './auth';
import OnboardStack from './onboard';

import innerScreens from './common';

enableScreens();
const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => {

	console.log("Render HomeTabs");
	
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();	
	
	const screenOptions = {
		tabBarShowLabel: true, 
		headerShown: false,
		tabBarActiveTintColor:theme.tabTint, 
		tabBarstyle: {
			backgroundColor: theme.tabBackground,
		}};

	return (
	  <Tabs.Navigator {...{screenOptions}} tabBar={props => <CustomTabBar {...props} />}>
		<Tabs.Screen name="Home" component={Home}/>
		<Tabs.Screen name="Portfolio" component={Portfolio}/>
		<Tabs.Screen name="Market" component={Market} />
	  	<Tabs.Screen name="Settings" component={Settings} />
	  </Tabs.Navigator>
	)
}

const TradingStack = () => {
	console.log("Render TradingStack");
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="HomeTabs" component={HomeTabs} />
      		{innerScreens(Stack)}
	    	<Stack.Screen name="Settings" component={Settings} />    
		</Stack.Navigator>
     )
}

const Routes = () => {

	console.log("Render Routes");
	
	const [hasInternet, setHasInternet] = useState(true);

	const {isLoading: isAppLoading} = useAppStartup();

	// Extract auth  from APP startup and make it dependent on app loading state
	// const {isLoadingAuth = true, verifiedUser = false, authMeta = null, userAccount = null } = {}; //= useAuth(); 
	const {isLoadingAuth, verifiedUser, authMeta, userAccount} = useAuth(); 
	
	// console.log(isLoadingAuth);
	// console.log(verifiedUser);
	// console.log(userAccount);

	//Subscribe to net events
	React.useEffect(() => {
		// Subscribe
		const unsubscribe = NetInfo.addEventListener(state => {
		  	// console.log("Connection type", state.type);
		  	// console.log("Is connected?", state.isConnected);
	  		setHasInternet(state.isConnected);
		});

		// Unsubscribe
		return () => unsubscribe();
	}, []);


	//Conditional Stacking; 
	//Should we stack uncondtionally and navigation be used to route?? - PERFORMANCE QUESTION

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				{!hasInternet 
					? <Stack.Screen name="NoInternet" component={NoInternet} />
				: 	isAppLoading ? 
						<Stack.Screen name="Splash" component={Splash} />
				:   (!isLoadingAuth && verifiedUser && !!userAccount) ?  
						<Stack.Screen name="Trading" component={TradingStack} />
				: 	(!isLoadingAuth && verifiedUser) ? 
						<Stack.Screen name="OnboardStack" component={OnboardStack} />
				: 
					<Stack.Screen name="Auth" component={AuthStack} />
				}
			</Stack.Navigator>
	   </NavigationContainer>
	)
}


const Router = (props) => {

	return (
		<WebsocketProvider>
			<ThemeProvider>
				<AuthProvider>
					<WatchlistProvider>
						<Routes/>
					</WatchlistProvider>
				</AuthProvider>
			</ThemeProvider>
		</WebsocketProvider>
   );
}

export default Router;
