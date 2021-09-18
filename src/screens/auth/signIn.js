import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AppView, ConfirmButton, TinyTextButton, AppIcon, OtpInput} from '../../components/common';
import { SignInForm } from '../../components/auth';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAuth, useLoading } from '../../helper';

//Add logic to save auth state to temp storage
const SignIn = (props) => {

	const {navigation} = props;
	const {phoneAuth, auto} = props?.route?.params ?? {};

	const {isLoading, updateLoading, loadingFunc} = useLoading(false); 

	const {theme, styles} = useStyles();
	const [error , setError] = useState(null);

	const {currentUser, verifiedUser,  userAccount, confirmPhone, signInEmail, signOut, signInPhone, submitPhoneCode} = useAuth();

	const [otp, setOtp] = useState('');

	useFocusEffect(React.useCallback(() => {
		updateLoading(false);
		setError(null);

		return () => updateLoading(false);
	}, []))

	React.useEffect(() => {
		// console.log("Running the useEffect in SignIn");
		// console.log("Whats the brokerage Account");
		// console.log(userAccount);
		// console.log(currentUser);

		if (verifiedUser && !!userAccount?.account && 
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

	const onSignInPhone = async() => {
		try {
			const phoneNumber = currentUser?.phoneNumber;
			console.log(phoneNumber);
			await loadingFunc(async() => await signInPhone(phoneNumber));
		} catch (err) {
			//handle error when phone number is inavlid/alredy used or other error
		}
	}

	const onSubmitCode = async() => {
		try {
			console.log("On Submit Phone Code: ", otp);
			await loadingFunc(async() => await submitPhoneCode(otp));
		} catch(err) {

		}

	}

	const onSignInEmail = async ({email, password}) => {
		console.log("onSignIn Email Pressed")
		try {
			await loadingFunc(async() => await signInEmail(email, password), {keep: true});
		} catch(error) {
			console.log(error);
			console.log(error.code);
		  	if (error.code == "auth/user-not-found") {
		  		setError("User not registered! Please sign up");
		  	}

		  	if (error.code == "auth/wrong-password") {
		  		setError("Incorrect Email/Password");
		  	}

		  	if (error.code == "auth/invalid-email") {
		  		setError("Incorrect Email/Password");
		  	}

		  	if (error.code == "auth/user-disabled") {
		  		setError("Accout has been disabled. Please contact Customer care!");
		  	}

		  	//My error
		  	if (error.code == "auth/email-not-verified") {
		  		navigation.navigate('AuthInfo', {type:'email-not-verified', message: 'The email is not verified. Please verify by your emial by clicking the link in the email.'})	
		  	}

		}
	}
		
	const signInMsg = "Successfully signed in!";

	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
			<StyledText style={styles.screenTitle}>SIGN IN</StyledText>

			<View style={{marginBottom: HP(5), alignItems: 'center', width: '100%'}}>
			{!!!phoneAuth ? 
				<SignInForm
					onSubmit={onSignInEmail}
					onError={setError}
					buttonTitle="SUBMIT"
					error={error} 
					submitButtonContainerStyle={styles.submitButtonContainer}
					submitButtonStyle={styles.submitButton}
					formContainerStyle={styles.formContainer}
				/>
				:
				<View style={{alignItems: 'center'}}>
					<StyledText style={{marginBottom: HP(5), color: theme.grey3}}> Verify your phone number to complete the Sign-In </StyledText>
					{!!!confirmPhone && <TinyTextButton title="Send Code" onPress={onSignInPhone}/>}
					{confirmPhone && <OtpInput code={otp} onCodeChange={setOtp} containerStyle={{marginBottom: HP(5)}}/>}
					{confirmPhone && <ConfirmButton title="SUBMIT OTP" onClick={onSubmitCode} buttonContainerStyle={{marginBottom: HP(5)}} buttonStyle={{width: '70%'}} />}
					{confirmPhone && <TinyTextButton title="Send Code Again" buttonTextStyle={{color: theme.grey5}} onPress={onSignInPhone}/>}
				</View>	
			}
			</View>

			<View style={styles.tinyButtonContainer}>
		   		<TinyTextButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('SignUp')} />
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
			marginBottom: HP(5)
		},
		submitButton: {
			width: '60%', 
			marginTop: WP(0),
		},
		tinyButtonContainer: {
			// position: 'absolute',
			// bottom: 50
		},
		logoContainer: {
			marginBottom: HP(5), 
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(6),
			color: theme.icon,
			marginBottom: HP(10)
		}
	})

	return {theme, styles};
}