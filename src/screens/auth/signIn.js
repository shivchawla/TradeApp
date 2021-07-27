import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { signIn, findUserDb, updateCurrentUser, getBrokerageAccount } from '../../helper'

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';

//Add logic to save auth state to temp storage
const SignIn = ({props}) => {

	// const [email , setemail] = useState('');
	// const [password , setpassword] = useState('');
	const [signedIn, setSignedIn] = useState(false);
	
	const navigation = props;

	const onSignIn = async ({email, password}) => {
		try {
			const userAccount = await signIn({email, password});
			if(userAccount) {
				await updateCurrentUser(userCredential);
				const userAccount = await findUserDb(userAccount.user.email);
				if (userAccount && userAccount.id) {
					const tradingAccount = await getBrokerageAccount(userAccount.id);
					if (tradingAccount.status == AccountStatus.ACTIVE) {
						navigation.navigate('Home')	
					} 

					//What to do in other status message

				} else {
					navigation.navigate('OnBoard')
				}
			} 
					
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
		    {!signedIn && <ConfirmButton title="Sign In" onClick={() => onSignIn({email: "shiv.chawla@yandex.com", password: "Fincript"})} />}
		    {signedIn && <Text>{signInMsg}</Text>}
		</AppView>
	);
}

export default SignIn;

