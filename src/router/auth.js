import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import {useAuth} from '../helper';

import SignIn from '../screens/auth/signIn';
import ForgotPassword from '../screens/auth/forgotPassword';
import SignUp from '../screens/auth/signUp';
import AuthInfo from '../screens/auth/authInfo';

const AuthStack = (props) => {

	const {currentUser, authMeta} = useAuth();
	const [signInParams, setSignInParams] = useState(null);
	const {navigation} = props;

	React.useEffect(() => {
		if (currentUser && !!!authMeta?.phoneAuth) {
			console.log("Updating signin params");
			navigation.navigate('SignIn', {phoneAuth: true});
		} else if (currentUser && !!!currentUser.emailVerified) {
			navigation.navigate('AuthInfo', {type: 'email-not-verified', message: 'Please click the link in the email we sent to complete the signup process.'})		}	
	}, [])

	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="SignIn" component={SignIn}/>
			<Stack.Screen name="SignUp" component={SignUp} />
			<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
			<Stack.Screen name="AuthInfo" component={AuthInfo} />
		</Stack.Navigator>
	);
};

export default AuthStack;
