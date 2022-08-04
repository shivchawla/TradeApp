import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NetInfo from "@react-native-community/netinfo";

import { AuthProvider, useAppStartup, useAuth, useBrokerageAccountData } from '../helper';
import { useTheme, ThemeProvider, StyledText } from  '../theme';
import { WebsocketProvider } from  '../helper';

import { CustomTabBar } from '../components/common';

import Splash from '../screens/splash';
import Market from '../screens/market';
import History from '../screens/history';
import OrdersTrades from '../screens/order/ordersTrades';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings';
import NoInternet from '../screens/errors/noInternet';

import AuthStack from './auth';
import OnboardStack from './onboard';

import innerScreens from './common';

enableScreens();
const Tabs = createBottomTabNavigator();
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
	    <Tabs.Screen name="Portfolio" component={Portfolio} />
	  	<Tabs.Screen name="Market" component={Market} />
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
	
	const [hasInternet, setHasInternet] = useState(true);
	const [isLoading , setIsLoading] = useState(true);	

	const appStartup = useAppStartup();

	// Extract auth  from APP startup and make it dependent on app loading state
	const { isLoadingAuth, verifiedUser, authMeta, userAccount } = useAuth(); 

	//Extract brokerage account from Auth as well
	// const {brokerageAccount, getBrokerageAccount} = useBrokerageAccountData({enabled: false})

	const navRef = React.useRef();

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

 	const pendingAction = !!userAccount && authMeta?.pending;

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				{(isLoadingAuth || isLoadingAuth == null) && <Stack.Screen name="Splash" component={Splash} />}

				{!hasInternet ? 
					<Stack.Screen name="NoInternet" component={NoInternet} />
					:
					<>
					{!!pendingAction ?? <Stack.Screen name={pendingAction} component={pendingAction} />}
					
					{(verifiedUser && !!userAccount) &&  
						<Stack.Screen name="Trading" component={TradingStack} />
					}
					
					{verifiedUser && 
						 <Stack.Screen name="OnboardStack" component={OnboardStack} />
					}

					<Stack.Screen name="Auth" component={AuthStack} />
					</>
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
					<Routes/>
				</AuthProvider>
			</ThemeProvider>
		</WebsocketProvider>
   );
}

export default Router;
