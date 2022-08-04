import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

import { AppView, ConfirmButton, TinyTextButton, AppIcon} from '../../components/common';
import { ForgotPasswordForm } from '../../components/auth';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';

//Add logic to save auth state to temp storage
const ForgotPassword = (props) => {

	const {theme, styles} = useStyles();

	const [error , setError] = useState(null);

	const {navigation} = props;

	const {currentUser, userAccount, sendSignInLink} = useAuth();
	
	const onForgotPassword = async ({email}) => {
		console.log("onForgotPassword Pressed")
		try {
			await sendSignInLink(email);
			navigation.navigate('AuthInfo', {
				message: `We have sent an email to ${email}. Please click on the link in the email to signIn and reset your password`
			});

		} catch(error) {
			console.log(error);
			console.log(error.code);
		}
	}
		
	return (
		<AppView goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
			<StyledText style={styles.screenTitle}>FORGOT PASSWORD</StyledText>

			<ForgotPasswordForm  
				onSubmit={onForgotPassword}
				onError={setError}
				buttonTitle="SUBMIT"
				error={error} 
				submitButtonContainerStyle={styles.submitButtonContainer}
				submitButtonStyle={styles.submitButton}
				formContainerStyle={styles.formContainer}
			/>
			
			<View style={styles.tinyButtonContainer}>
		   		<TinyTextButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('SignUp')} />
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
		// tinyButtonContainer: {
		// 	marginTop: HP(10)
		// },
		logoContainer: {
			marginBottom: HP(5), 
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(6),
			color: theme.icon,
			marginBottom: HP(5)
		},
	})

	return {theme, styles};
}