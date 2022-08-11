import React, {useState} from 'react';
import { View, StyleSheet} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppView, ConfirmButton, TinyTextButton, AppIcon, OtpInput} from '../../components/common';
import { SignInForm } from '../../components/auth';
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { useAuth, useLoading } from '../../helper';
import { ACCOUNT_STATUS, SCREEN_NAMES } from '../../config';

//Add logic to save auth state to temp storage
const SignIn = (props) => {

	const {t} = useTranslation();

	const {navigation} = props;
	const {phoneAuth} = props?.route?.params ?? {};

	const {isLoading, updateLoading, loadingFunc} = useLoading(false); 

	const {theme, styles} = useStyles();
	const [error , setError] = useState(null);

	const {currentUser, verifiedUser,  userAccount, confirmPhone, signInEmail, signInPhone, submitPhoneCode} = useAuth();

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
				userAccount?.account?.status == ACCOUNT_STATUS.ACTIVE) {

			navigation.navigate(SCREEN_NAMES.Trading)	
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
		  		setError(t('auth:error.userNotFound'));
		  	}

		  	if (error.code == "auth/wrong-password") {
				setError(t('auth:error.incorrectEmailPwd'));  
		  	}

		  	if (error.code == "auth/invalid-email") {
				setError(t('auth:error.incorrectEmailPwd'));
		  	}

		  	if (error.code == "auth/user-disabled") {
				setError(t('auth:error.userDisabled'));
		  	}

		  	//My error
		  	if (error.code == "auth/email-not-verified") {
		  		navigation.navigate('AuthInfo', {type:'email-not-verified', message: t('auth:error.verifyEmail')})	
		  	}
		}
	}
			
	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			
			<AppIcon logoContainerStyle={styles.logoContainer} 
				logoStyle={styles.logoStyle} 
			/>

			<View style={styles.leftContainer}>
				<StyledText style={styles.screenTitle}>{t('auth:signIn.title')}</StyledText>
				<StyledText style={styles.screenDesc}>{t('auth:signIn.description')}</StyledText>
			</View>	

			<View style={{marginBottom: HP(5), alignItems: 'center', width: '100%'}}>
			{!!!phoneAuth ? 
				<SignInForm
					onSubmit={onSignInEmail}
					onError={setError}
					buttonTitle={t('auth:signIn.submit')}
					error={error} 
					submitButtonContainerStyle={styles.submitButtonContainer}
					submitButtonStyle={styles.submitButton}
					submitButtonTextStyle={styles.submitText}
					formContainerStyle={styles.formContainer}
				/>
				:
				<View style={{alignItems: 'center'}}>
					<StyledText style={{marginBottom: HP(5), color: theme.grey3}}> {t('auth:phoneVerificationMsg')} </StyledText>
					{!!!confirmPhone && <TinyTextButton title={t('auth:sendCode')} onPress={onSignInPhone}/>}
					{confirmPhone && <OtpInput code={otp} onCodeChange={setOtp} containerStyle={{marginBottom: HP(5)}}/>}
					{confirmPhone && <ConfirmButton title={t('auth:submitOtp')} onClick={onSubmitCode} buttonContainerStyle={{marginBottom: HP(5)}} buttonStyle={{width: '70%'}} />}
					{confirmPhone && <TinyTextButton title={t('auth:sendCodeAgain')} buttonTextStyle={{color: theme.grey5}} onPress={onSignInPhone}/>}
				</View>	
			}
			</View>

			<View style={styles.tinyButtonContainer}>
				<StyledText style={styles.createAccountText}>{t('auth:signIn.signUpQuestion')}</StyledText>
				<TinyTextButton title={t('auth:createAccount.title')} onPress={() => navigation.navigate('SignUp')} />
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
		leftContainer:{
			marginBottom: HP(5),
			alignItems: 'flex-start',
			width: '100%',
			paddingLeft: WP(5)	
		},
		formContainer: {
			flex: 0, 
		},
		submitButtonContainer:{
			position: 'relative', 
			marginBottom: HP(5)
		},
		submitButton: {
			width: '90%', 
			marginTop: WP(0),
			borderRadius: 5,
			height: 40
		},
		submitText: {
			fontSize: WP(6)
		},
		tinyButtonContainer: {
			// position: 'absolute',
			// bottom: 50
		},
		logoContainer: {
			paddingLeft: WP(5),
			width: '100%',
			alignItems: 'flex-start',
			position: 'absolute',
			top: 10
		},
		logoStyle: {
			width: WP(50), 
			marginBottom: HP(1)
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(8),
			color: theme.icon,
		},
		screenDesc: {
			fontSize: WP(4),

		},
		createAccountText: {
			color: theme.grey3
		}
	})

	return {theme, styles};
}