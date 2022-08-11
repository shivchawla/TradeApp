import React, {useState} from 'react';
import { View, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppView, TinyTextButton, AppIcon} from '../../components/common';
import { ForgotPasswordForm } from '../../components/auth';
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';

//Add logic to save auth state to temp storage
const ForgotPassword = (props) => {

	const {styles} = useStyles();
	const [error , setError] = useState(null);
	const {navigation} = props;
	const {t} = useTranslation();
	const {sendSignInLink} = useAuth();
	
	const onForgotPassword = async ({email}) => {
		console.log("onForgotPassword Pressed")
		try {
			await sendSignInLink(email);
			navigation.navigate('AuthInfo', {
				message: `${t('auth:forgotPwd.instructionOne')} ${email}. ${t('auth:forgotPwd.instructionTwo')}`
			});

		} catch(error) {
			console.log(error);
			console.log(error.code);
		}
	}
		
	return (
		<AppView goBack={false} scroll={false} scrollViewStyle={styles.screenContentStyle} keyboardMode="overlap">
			
			<AppIcon logoContainerStyle={styles.logoContainer} 
				logoStyle={styles.logoStyle} 
			/>

			<View style={styles.leftContainer}>
				<StyledText style={styles.screenTitle}>{t('auth:forgotPwd.title')}</StyledText>
				<StyledText style={styles.screenDesc}>{t('auth:forgotPwd.description')}</StyledText>
			</View>	

			<ForgotPasswordForm  
				onSubmit={onForgotPassword}
				onError={setError}
				buttonTitle={t('auth:forgotPwd.submit')}
				error={error} 
				submitButtonContainerStyle={styles.submitButtonContainer}
				submitButtonStyle={styles.submitButton}
				submitButtonTextStyle={styles.submitText}
				formContainerStyle={styles.formContainer}
			/>

			<View style={styles.tinyButtonContainer}>
				<StyledText style={styles.createAccountText}>{t('auth:forgotPwd.signInQuestion')}</StyledText>
				<TinyTextButton title={t('auth:signIn.title').toUpperCase()} onPress={() => navigation.navigate('SignIn')} />
			</View>
			
			<View style={styles.tinyButtonContainer}>
				<StyledText style={styles.createAccountText}>{t('auth:forgotPwd.signUpQuestion')}</StyledText>
				<TinyTextButton title={t('auth:createAccount.title')} onPress={() => navigation.navigate('SignUp')} />
			</View>
	   </AppView>
	);
}

export default ForgotPassword;

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		screenContentStyle: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		formContainer: {
			flex:0, 
		},
		leftContainer:{
			marginTop: HP(5),
			marginBottom: HP(8),
			alignItems: 'flex-start',
			width: '100%',
			paddingLeft: WP(5)	
		},
		logoStyle: {
			width: WP(50), 
			marginBottom: HP(1)
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
			marginTop: HP(5),
			alignItems: 'center'
		},
		logoContainer: {
			paddingLeft: WP(5),
			width: '100%',
			alignItems: 'flex-start',
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(7),
			color: theme.icon,
		},
		screenDesc: {
			fontSize: WP(4),
		},
	})

	return {theme, styles};
}