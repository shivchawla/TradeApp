import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

import { useAuth, setStorageData, useLoading } from '../../helper';
import { AppView, ConfirmButton, TinyTextButton, AppIcon, OtpInput } from '../../components/common';
import { SignUpForm } from '../../components/auth';

import { useTheme, StyledText, WP, HP }  from '../../theme';

const SignUp = (props) => {

	const {currentUser, signUpPhone, linkEmail, confirmPhone, submitPhoneCode, resetPhoneAuth, resetAuth, signOut} = useAuth();
	// console.log(props?.route?.params?.signUpType);

	const [signUpType, setSignUpType] = useState(props?.route?.params?.signUpType || 'phone');
	const [error, setError] = useState(null);
	const [signedUp, setSignedUp] = useState(false);
	const {isLoading, updateLoading, loadingFunc} = useLoading(false); 
	
	const [phoneCredentials, setPhoneCredentials] = useState(null);
	const [emailCredentials, setEmailCredentials] = useState(null);	

	const [otp, setOtp] = useState(null); 
	const {navigation} = props

	useFocusEffect(React.useCallback(() => {
		// console.log("useFocusEffect");
		updateLoading(false);

		return () => updateLoading(false);
	}, []))


	// It's already handled in AuthStack
	// React.useEffect(() => {
	// 	// console.log("useEffect [currentUser]");
	// 	if (currentUser && !!currentUser.email && !!!currentUser.emailVerfied) {
	// 		navigation.navigate('AuthInfo', {type: 'email-not-verified', message: 'Please click the link in the email we sent to complete the signup process.'})
	// 	}
	// }, [currentUser])

	React.useEffect(() => {

		const handleChangePhoneCredentials = async() => {
			if (phoneCredentials) {
				//When phone is confirmed update storage
				//when does this expire
				// await setStorageData("phoneAuth", JSON.stringify(phoneCredentials));

				// console.log("Setting up signup type to PHONE");
				//Now, move on-to email auth
				setSignUpType("email");
				updateLoading(false);
			}
		}

		handleChangePhoneCredentials()

	}, [phoneCredentials])


	const onSubmitOtp = async() => {
		try {
			const phoneAuthCredentials = await loadingFunc(async() => await submitPhoneCode(otp), {keep: true});
			// console.log(phoneAuthCredentials);
			setPhoneCredentials(phoneAuthCredentials);
			setOtp(''); 
	    } catch (error) {
	    	// console.log("OOOPPPS");
	    	// console.log(error);
	    	// console.log(error.code);
	    	updateLoading(false);
	    	if (error.code === "auth/invalid-verification-code") {
				setOtp('');
				setError('Invalid OTP code');
			}
    	}
	}

	const onSignUpPhone = async ({phoneNumber}) => {
		console.log("On SignUp - Phone");
		console.log(phoneNumber);

		setError(null);

		try {
			await loadingFunc(async() => await signUpPhone(phoneNumber));
		} catch (error) {
			setError(error.code);
		}

	}

	const onSignUpEmail = async ({email, password}) => {
		try {
			// console.log("Signing up with email -- LINKING")
			const userCredential = await loadingFunc(async() => await linkEmail({email, password}), {keep: true});
			setEmailCredentials(userCredential);
						
		} catch(error) {
			if (error.code === 'auth/email-already-in-use') {
				setError('That email address is already in use!');
			}

			//What does it mean? happens when already signed in phone is connected to 
			//new user account
			if (error.code === 'auth/credential-already-in-use') {
				setError(error.code);
			}

			if (error.code === 'auth/invalid-email') {
				setError('That email address is invalid!');
			}

			if (error.code == 'auth/requires-recent-login') {
				setError('Code has expired!! Click SEND OTP to receive the code again!')
				
				await resetPhoneAuth();
				//Restart phone authentication
				setSignUpType('phone');
			}
		}
	}
	
	const {theme, styles} = useStyles();

	// console.log(isLoading);

	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle} showLogo={true}>
			<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
			<StyledText style={styles.screenTitle}>SIGN UP</StyledText>
			<View style={styles.stepTextContainer}>
				{/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
					{signUpType == "phone" && <StyledText style={styles.currentStepText}>Register Phone</StyledText>}
					{/*{signUpType == "email" && <View style={styles.circle}></View>}*/}
				{/*</View>*/}
				{signUpType == "email" && <StyledText style={styles.currentStepText}>Register Email</StyledText>}
			</View>

			<View style={{marginBottom: HP(5), alignItems: 'center', width: '100%'}}>
				{((signUpType == "phone" && !confirmPhone) || signUpType == "email") && <SignUpForm 
					type={signUpType}
					buttonTitle={signUpType == "phone" ? confirmPhone ? 'CONFIRM OTP' : 'SEND OTP' : 'CREATE ACCOUNT'} 
					disabled={!!(signUpType == "phone" && confirmPhone)} 
					onSubmit={signUpType == "phone" ? onSignUpPhone : onSignUpEmail}
					onError={setError}
					error={error}
					submitButtonContainerStyle={styles.submitButtonContainer}
					submitButtonStyle={styles.submitButton}
					formContainerStyle={styles.formContainer}
				/>}

				{(signUpType == "phone" && confirmPhone && !!!error) &&
					<>
					{!!error && 
						<View style={{alignItems: 'center', justifyContent:'center'}}>
							<StyledText style={styles.error}>{error}</StyledText>
						</View>
					}
					<View key="otpContainer" style={{alignItems: 'center'}}>
						<OtpInput code={otp} onCodeChange={(code) => setOtp(code)} onFocus={() => setError('')} />
						<ConfirmButton title="SUBMIT OTP" onClick={onSubmitOtp} buttonContainerStyle={{marginTop: HP(10)}} buttonStyle={styles.submitButton}/>
					</View>
					</>
				}
			</View>

			<View style={styles.tinyButtonContainer}>
				<TinyTextButton title="SIGN IN" onPress={() => {resetAuth(); navigation.navigate('SignIn')}} />
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
			fontSize: WP(4),
			marginTop: HP(1)
		},
		error: {
			color: theme.error,
			marginBottom: HP(5),
			textAlign: 'center'
		},
		circle: {
			height: HP(1),
			width: HP(1),
			borderRadius: HP(0.5),
			backgroundColor: theme.green,
			marginLeft: WP(2),
			justifyContent: 'center',
			alignItems: 'center'
		}
	})

	return {theme, styles};
}

export default SignUp;

