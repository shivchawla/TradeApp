import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

import { AppView, ConfirmButton} from '../../components/common';
import { SignInForm } from '../../components/auth';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';

//Add logic to save auth state to temp storage
const SignIn = (props) => {

	// const [email , setemail] = useState('');
	// const [password , setpassword] = useState('');
	const [error , setError] = useState(null);

	const {navigation} = props;

	const {currentUser, userAccount, signIn, brokerageAccount, signOut} = useAuth();
	
	React.useEffect(() => {
		console.log("Running the useEffect in SignIn");
		console.log("Whats the brokerage Account");
		console.log(brokerageAccount);
		console.log(currentUser);

		if (!!brokerageAccount?.data) {
			if (brokerageAccount.data.status == AccountStatus.ACTIVE) {
				navigation.navigate('Trading')	
			} 

			//What to do in other status message

		} else if (!!currentUser?.user) {
			// console.log("~~~~Sign out!!!!");
			// signOut()
			console.log("Navigating to Onboard");
			navigation.navigate('Onboard')
		} 

	}, [currentUser, brokerageAccount]);

	const onSignIn = async (email, password) => {
		console.log("onSignIn Pressed")
		try {
			await signIn(email, password);			
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

	const onSubmit = async (values, {validateForm, resetForm}) => {
		await onSignIn(values.email, values.password);
      resetForm();
	}

	return (
		<AppView title="SIGN IN" headerTitleStyle={{color: 'white'}} goBack={false}>
			
			<View style={styles.formikContainer}>
				{error && <StyledText style={styles.signInError}>{error} </StyledText>}
				<SignInForm setSignInError={setError} onSubmit={onSubmit} />
		   </View>
		   
	   </AppView>
	);
}

export default SignIn;

const styles = StyleSheet.create({
	formikContainer: {
		justifyContent: 'center', 
		textAlign: 'center', 
		flex:1, 
		width: '100%',
	}
});