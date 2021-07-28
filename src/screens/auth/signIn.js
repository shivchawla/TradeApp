import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { useAuth } from '../../helper'

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';

//Add logic to save auth state to temp storage
const SignIn = (props) => {

	// const [email , setemail] = useState('');
	// const [password , setpassword] = useState('');
	const {navigation} = props;

	const {currentUser, userAccount, signIn, brokerageAccount} = useAuth();
	
	React.useEffect(() => {
		console.log("Running the useEffect in SignIn");
		console.log("Whats the brokerage Account");
		console.log(brokerageAccount);

		if (!!brokerageAccount?.data) {
			if (brokerageAccount.data.status == AccountStatus.ACTIVE) {
				navigation.navigate('Trading')	
			} 

			//What to do in other status message

		} else if (!!currentUser) {
			console.log("Navigating to Onboard");
			navigation.navigate('Onboard')
		}

	}, [currentUser, brokerageAccount]);

	console.log("Auth Stack - SignIn");
	console.log("Current User");
	console.log(currentUser);

	const onSignIn = async ({email, password}) => {
		console.log("onSignIn Pressed")
		try {
			await signIn({email, password});			
		} catch(error) {
		  	if (error.code == "auth/user-not-found") {
		  		alert("User not registered! Please sign up");
		  	}

		  	if (error.code == "auth/wrong-password") {
		  		alert("Incorrect Password");
		  	}

		  	if (error.code == "auth/invalid-email") {
		  		alert("Invalid email. Please check your email");
		  	}

		  	if (error.code == "auth/user-disabled") {
		  		alert("Accout has been disabled. Please contact Customer care!");
		  	}

		  	//My error
		  	if (error.code == "auth/email-not-verified") {
		  		alert("Accout has been disabled. Please contact Customer care!");	
		  	}
		}
	}
		
	const signInMsg = "Successfully signed in!";

	return (
		<AppView title="Sign In" goBack={false}>
		    {!!!currentUser ? 
	    		<ConfirmButton title="Sign In" onClick={() => onSignIn({email: "shiv.chawla@yandex.com", password: "Fincript"})} />
		    : <Text>{signInMsg}</Text>}
		</AppView>
	);
}

export default SignIn;

