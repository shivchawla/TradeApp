import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

import { useAuth, setStorageData, useLoading } from '../../helper';
import { AppView, ConfirmButton, TinyTextButton, AppIcon, OtpInput } from '../../components/common';
import { SignUpForm } from '../../components/auth';

import { useTheme, StyledText, WP, HP }  from '../../theme';

const SignUp = (props) => {

	const {currentUser, signUpPhone, signUpEmail, phoneConfirm, getPhoneCredentials} = useAuth();

	const [signUpType, setSignUpType] = useState('phone');
	const [error, setError] = useState(null);
	const [signedUp, setSignedUp] = useState(false);
	const {isLoading, loadingFunc} = useLoading(false); 
	
	const [phoneCredentials, setPhoneCredentials] = useState(null);
	const [emailCredentials, setEmailCredentials] = useState(null);	

	const [otp, setOtp] = useState(null); 

	const {navigation} = props

	// useFocusEffect(React.useCallback(() => {
	// 	setLoading(false);
	// }, []))

	React.useEffect(() => {
		if (currentUser && !!!currentUser.emailVerfied) {
			navigation.navigate('AuthInfo', {type: 'email-not-verified', message: 'Please click the link in the email we sent to complete the signup process.'})
		}
	}, [currentUser])

	React.useEffect(() => {

		const handleChangePhoneCredentials = async() => {
			if (phoneCredentials) {
				//When phone is confirmed update storage
				//when does this expire
				// await setStorageData("phoneAuth", JSON.stringify(phoneCredentials));

				//Now, move on-to email auth
				setSignUpType("email");
			}
		}

		handleChangePhoneCredentials()

	}, [phoneCredentials])

	// React.useEffect(() => {

	// 	const handleChangeEmailCredentials = async() => {
	// 		if (emailCredentials) {
	// 			//When phone is confirmed update storage
	// 			//when does this expire
	// 			await setStorageData("emailAuth", JSON.stringify(emailCredentials));

	// 			if (emailCredentials && phoneCredentials) {
	// 				//Now, move on-to email auth
	// 				setSignedUp(true);	
	// 			}
	// 		}
	// 	}

	// 	handleChangeEmailCredentials();

	// }, [emailCredentials])

	const onSubmitOtp = async() => {
		try {
			const phoneAuthCredentials = await loadingFunc(async() => await getPhoneCredentials(otp));
			console.log(phoneAuthCredentials);
			setPhoneCredentials(phoneAuthCredentials);

	    } catch (error) {
	    	console.log(error);
			setError('Invalid OTP code');
    	}
	}

	const onSignUpPhone = async ({phoneNumber}) => {
		console.log("On SignUp - Phone");
		console.log(phoneNumber);

		try {
			await loadingFunc(async() => await signUpPhone(phoneNumber));
		} catch (error) {
			setError(error.code);
		}

		// console.log("Ending onSignUpPhone");
	}

	const onSignUpEmail = async ({email, password}) => {
		console.log("In onSignup - Email");
		console.log(email);
		console.log(password);
		console.log(phoneCredentials);
		
		try {
			const userCredential = await loadingFunc(async() => await signUpEmail({email, password}, {linkTo: phoneCredentials}));
			console.log(userCredential);
			console.log("User successfully signed/created with EMAIL");
			
			setEmailCredentials(userCredential);
						
		} catch(error) {
			if (error.code === 'auth/email-already-in-use') {
				alert('That email address is already in use!');
			}

			if (error.code === 'auth/invalid-email') {
				alert('That email address is invalid!');
			}

			console.error(error);
		}
	}
	
	const {theme, styles} = useStyles();

	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle} showLogo={true}>
			<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
			<StyledText style={styles.screenTitle}>SIGN UP</StyledText>
			<View style={styles.stepTextContainer}>
				{signUpType == "phone" && <StyledText style={styles.currentStepText}>Register Phone</StyledText>}
				{signUpType == "email" && <StyledText style={styles.currentStepText}>Register Email</StyledText>}
			</View>

			<View style={{marginBottom: HP(5), alignItems: 'center', width: '100%'}}>
				{((signUpType == "phone" && !phoneConfirm) || signUpType == "email") && <SignUpForm 
					type={signUpType}
					buttonTitle={signUpType == "phone" ? phoneConfirm ? 'CONFIRM OTP' : 'SEND OTP' : 'CREATE ACCOUNT'} 
					disabled={!!(signUpType == "phone" && phoneConfirm)} 
					onSubmit={signUpType == "phone" ? onSignUpPhone : onSignUpEmail}
					onError={setError}
					error={error}
					submitButtonContainerStyle={styles.submitButtonContainer}
					submitButtonStyle={styles.submitButton}
					formContainerStyle={styles.formContainer}
				/>}

				{(signUpType == "phone" && phoneConfirm) && 
					<View style={{alignItems: 'center'}}>
						<OtpInput code={otp || ''} onCodeChange={setOtp}/>
						<ConfirmButton title="SUBMIT OTP" onClick={onSubmitOtp} buttonContainerStyle={{marginTop: HP(10)}} buttonStyle={styles.submitButton}/>
					</View>
				}
			</View>

			<View style={styles.tinyButtonContainer}>
				<TinyTextButton title="SIGN IN" onPress={() => navigation.navigate('SignIn')} />
			</View>

		</AppView>
	);
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		screenContentStyle: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		formContainer: {
			flex:0, 
			// marginBottom: HP(5)
		},
		submitButtonContainer:{
			position: 'relative', 
			marginBottom: HP(5)
			// top: 0
		},
		submitButton: {
			width: '70%', 
			marginTop: WP(0),
		},
		tinyButtonContainer: {
			// marginTop: HP(10)
		},
		logoContainer: {
			marginBottom: HP(5), 
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(6),
			color: theme.icon
		},
		stepTextContainer: {
			marginBottom: HP(5),
		},
		currentStepText: {
			color: theme. grey5,
			fontSize: WP(5)
		}
	})

	return {theme, styles};
}

export default SignUp;

