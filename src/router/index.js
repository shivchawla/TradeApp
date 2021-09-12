import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NetInfo from "@react-native-community/netinfo";

import { AuthProvider, useAppStartup, useAuth, useBrokerageAccountData } from '../helper';
import { useTheme, ThemeProvider, StyledText } from  '../theme';
import { WebsocketProvider } from  '../helper';

import { CustomTabBar } from '../components/common';

import Market from '../screens/market';
import History from '../screens/history';
import OrdersTrades from '../screens/order/ordersTrades';
import Portfolio from '../screens/portfolio';
import Settings from '../screens/settings';
import NoInternet from '../screens/extra/noInternet';

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
	
	const [hasInternet, setHasInternet] = useState(true);	
	const {isLoading: isLoadingApp} = useAppStartup();

	// Extract auth  from APP startup and make it dependent on app loading state
	const { isLoadingAuth, currentUser, userAccount } = useAuth(); //Club the output into one!!!

	//Extract brokerage account from Auth as well
	const {brokerageAccount, getBrokerageAccount} = useBrokerageAccountData({enabled: false})

	//Subscribe to net events
	React.useEffect(() => {
		// Subscribe
		const unsubscribe = NetInfo.addEventListener(state => {
		  	console.log("Connection type", state.type);
		  	console.log("Is connected?", state.isConnected);
	  		setHasInternet(state.isConnected);
		});

		// Unsubscribe
		return () => unsubscribe();
	}, []);

	React.useEffect(() => {
		(async() => {
			if (userAccount) {
				//After storage data is updated
				await getBrokerageAccount();			
			} 
		})()	
	}, [userAccount])

	
	const isLoading = isLoadingAuth || (userAccount && !brokerageAccount);

	console.log("Is Loading");
	console.log(isLoading);

	console.log("Current User");
	console.log(currentUser);

	console.log("User Account");
	console.log(userAccount);

	console.log("Brokerage Account")
	console.log(brokerageAccount);
	
	return (
		<>
		{isLoading ? 
			<StyledText style={{color: 'white'}}>Loading...</StyledText>
			:	
			<NavigationContainer>
				<Stack.Navigator screenOptions={{headerShown: false}}>
					{!hasInternet ? 
						<Stack.Screen name="NoInternet" component={NoInternet} />
						:
						<>
						{!!currentUser?.emailVerified && !!brokerageAccount && 
							<Stack.Screen name="Trading" component={TradingStack} />
						}
						{!!currentUser?.emailVerified ?
							 <Stack.Screen name="OnboardStack" component={OnboardStack} />
							: <Stack.Screen name="Auth" component={AuthStack} />
						}
						</>
					}
				</Stack.Navigator>
		   </NavigationContainer>
		}
		</>
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
