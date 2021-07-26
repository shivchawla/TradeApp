import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import { setStorageData, getStorageData } from '../../helper'

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';
const USER_STORAGE_KEY = 'userCredentials';

//Add logic to save auth state to temp storage
const SignIn = ({props}) => {

	// const [email , setemail] = useState('');
	// const [password , setpassword] = useState('');
	const [signedIn, setSignedIn] = useState(false);
	
	React.useEffect(() => {
		const checkUserCredential  = async () => {
			const userCredential = await getStorageData(USER_STORAGE_KEY);
			if (userCredentials) {
				setSignedIn(true);
			}
		}

		checkUserCredential();
  	}, []);

	const onSignIn = async ({email, password}) => {
		
		console.log("In onSignIn")

		try {
			const userCredential = await auth().signInWithEmailAndPassword(email , password)
			console.log(userCredential);

		  	if (userCredential.user.emailVerified) {
		        await setStorageData(USER_STORAGE_KEY, JSON.stringify(userCredential));
		        setSignedIn(true);
		  	}
		}  catch(error) {
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

		    console.error(error);
		}
	}

	const signInMsg = "Successfully signed in!";

	return (
		<AppView title="Sign In">
		    {!signedIn && <ConfirmButton title="Sign In" onClick={() => onSignIn({email: "shiv.chawla@yandex.com", password: "Fincript"})} />}
		    {signedIn && <Text>{signInMsg}</Text>}
		</AppView>
	);
}

export default SignIn;

