import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

import { AppView, ConfirmButton, TinyTextButton} from '../../components/common';
import { SignInForm } from '../../components/auth';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';

//Add logic to save auth state to temp storage
const SignIn = (props) => {

	const {theme, styles} = useStyles();

	const [error , setError] = useState(null);

	const {navigation} = props;

	const {currentUser, userAccount, signInEmail, signOut} = useAuth();
	
	React.useEffect(() => {
		console.log("Running the useEffect in SignIn");
		console.log("Whats the brokerage Account");
		console.log(userAccount);
		console.log(currentUser);

		if (!!userAccount?.account && 
				userAccount?.account?.status == 'ACTIVE') {

			navigation.navigate('Trading')	
		} 

		//What to do in other status message

		// else if (!!currentUser?.user) {
		// 	// console.log("~~~~Sign out!!!!");
		// 	// signOut()
		// 	console.log("Navigating to Onboard");
		// 	navigation.navigate('Onboard')
		// } 

	}, [userAccount]);

	const onSignInEmail = async ({email, password}) => {
		console.log("onSignIn Email Pressed")
		try {
			await signInEmail(email, password);			
		} catch(error) {
			console.log(error);
			console.log(error.code);
		  	if (error.code == "auth/user-not-found") {
		  		setError("User not registered! Please sign up");
		  	}

		  	if (error.code == "auth/wrong-password") {
		  		setError("Incorrect Password");
		  	}

		  	if (error.code == "auth/invalid-email") {
		  		setError("Invalid email. Please check your email");
		  	}

		  	if (error.code == "auth/user-disabled") {
		  		setError("Accout has been disabled. Please contact Customer care!");
		  	}

		  	//My error
		  	if (error.code == "auth/email-not-verified") {
		  		setError("Accout has been disabled. Please contact Customer care!");	
		  	}
		}
	}
		
	const signInMsg = "Successfully signed in!";

	return (
		<AppView title="SIGN IN" goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			<SignInForm  
				onSubmit={onSignInEmail}
				onError={setError}
				error={error} 
				submitButtonContainerStyle={styles.submitButtonContainer}
				submitButtonStyle={styles.submitButton}
				formContainerStyle={styles.formContainer}
			/>
			<View style={styles.tinyButtonContainer}>
		   	<TinyTextButton title="SIGN UP" onPress={() => navigation.navigate('SignUp')} />
	   	</View>
	   </AppView>
	);
}

export default SignIn;

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		screenContentStyle: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		formContainer: {
			flex:0, 
			// marginBottom: HP()
		},
		submitButtonContainer:{
			position: 'relative', 
			// top: 0
		},
		submitButton: {
			width: '60%', 
			marginTop: WP(0),
		},
		tinyButtonContainer: {
			marginTop: HP(10)
		}
	})

	return {theme, styles};
}