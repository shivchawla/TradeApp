import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import {AppView} from '../components/common';
import {useAuth, useLoading} from '../helper';

import SignIn from '../screens/auth/signIn';
import ForgotPassword from '../screens/auth/forgotPassword';
import SignUp from '../screens/auth/signUp';
import AuthInfo from '../screens/auth/authInfo';
import Splash from '../screens/splash';

const AuthStack = (props) => {

	const {isLoadingAuth, currentUser, authMeta, linkError, verifiedUser, userAccount} = useAuth();
	const [signInParams, setSignInParams] = useState(null);
	const {navigation} = props;

	React.useEffect(() => {
		if (!!!currentUser) {
			navigation.push('SignIn');
		} else if (currentUser && !!!currentUser.email && !!!authMeta?.phoneAuth) { 
			navigation.push('SignUp', {signUpType: 'phone'}); 
		} else if (currentUser && !!!currentUser.email) {
			//Email signup still pending
			//Write logic to ask OTP again if phone sign up more than 1 hour ****
			navigation.push('SignUp', {signUpType: 'email'});
		} else if (currentUser && !!authMeta?.emailAuth && !!!authMeta?.phoneAuth) {
			// console.log("Updating signin params");
			navigation.navigate('SignIn', {phoneAuth: true});
		} else if (currentUser && linkError) {
			navigation.navigate('AuthInfo', {
				type: linkError, 
				message: 'Verification Link has expired or invalid. Please click Send Email Again to receive a new email.'
			})
		} else if (currentUser && !!currentUser.email && !!!currentUser.emailVerified) {
			navigation.navigate('AuthInfo', {
				type: 'email-not-verified', 
				message: 'Please click the link in the email we sent to complete the signup process.'
			})
		} else if (verifiedUser && !!!userAccount && !isLoadingAuth) {
			navigation.navigate('OnboardStack');
		}

	}, [currentUser, linkError])

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
