import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/FontAwesome';
import get from 'lodash/get';

import { signIn, findUserDb, useCheckCredentials, useUserAccount, useBrokerageAccountData } from '../helper'

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

const homeTabs = () => {
     return (
        <Tabs.Navigator>
          <Tabs.Screen name="SignIn" component={SignIn} />
          {/*<Tabs.Screen name="Market" component={Market} />*/}
          {/*<Tabs.Screen name="ChooseStock" component={ChooseStock}/>*/}
          <Tabs.Screen name="OrdersTrades" component={OrdersTrades} />

          <Tabs.Screen name="Portfolio" component={Portfolio} />
        </Tabs.Navigator>
     )
}

//Used dependent hooks....Will it work? Let's find tomorrow!!!
const Router = (props) => {

	const currentUser = useCheckCredentials();
	const userAccount = useUserAccount(get(currentUser, 'user.email', null));
	const brokerageAccount = useBrokerageAccountData(get(userAccount, 'id', null));
	
	return (
	  <NavigationContainer>
	  	{currentUser && brokerageAccount ?
		     <Stack.Navigator screenOptions={{headerShown: false}}>
		        <Stack.Screen name="Home" component={homeTabs} />
		        {innerScreens(Stack)}
		     </Stack.Navigator>
		    :
		    currentUser ?  <OnboardStack /> : <AuthStack />
	    }
	   </NavigationContainer>
   );
}

export default Router;
