import React, {useState} from 'react';
import { View, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppView, TinyTextButton, AppIcon} from '../../components/common';
import { ForgotPasswordForm } from '../../components/auth';
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';
import { AuthLayout, AuthFooterDefault } from './authLayout';


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
		<AuthLayout header={{title: t('auth:forgotPwd.title'), description: t('auth:forgotPwd.description')}}>
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

			<AuthFooterDefault 
				footerText={t('auth:forgotPwd.signInQuestion')} 
				buttonTitle={t('auth:signIn.title').toUpperCase()}
				onPress={() => {navigation.navigate('SignIn')}}
			/>

			<AuthFooterDefault 
				footerText={t('auth:forgotPwd.signUpQuestion')} 
				buttonTitle={t('auth:createAccount.title').toUpperCase()}
				onPress={() => {navigation.navigate('SignUp')}}
			/>
	   </AuthLayout>
	);
}

export default ForgotPassword;

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
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
		}
	})

	return {theme, styles};
}