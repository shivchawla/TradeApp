import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

import { AppView, ConfirmButton, TinyTextButton, AppIcon} from '../../components/common';
import { SignInForm } from '../../components/auth';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAuth, useLoading } from '../../helper';

//Add logic to save auth state to temp storage
const AuthInfo = (props) => {

	const {theme, styles} = useStyles();

	const {navigation} = props;
	const {message, type} = props.route.params;
	const {sendEmailVerification, signOut} = useAuth();
	const {isLoading, loadingFunc} = useLoading(false);

	const sendEmail = async() => {
		console.log("Sending Verfication Email Again");
		await loadingFunc(async() =>  await sendEmailVerification())
	}

	const signInAgain = async() => {
		await signOut()
		navigation.navigate('SignIn')
	}

	return (
		<AppView isLoading={isLoading} goBack={false} scroll={false} staticViewStyle={styles.screenContentStyle}>
			<View style={{position: 'absolute', top:HP(10), alignItems: 'center'}}>
				<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
				<StyledText style={styles.screenTitle}>FINCRIPT</StyledText>
			</View>
			<StyledText style={{textAlign: 'center', marginBottom: HP(10)}}>{message}</StyledText>

			{type == "email-not-verified" && 
				<TinyTextButton title="Send Email Again" onPress={sendEmail} />
			}

			<View style={styles.tinyButtonContainer}>
				<TinyTextButton title="SIGN IN AGAIN" onPress={signInAgain} buttonStyle={{marginBottom: HP(2)}}/>
		   		<TinyTextButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('SignUp')} />
	   		</View>
	   </AppView>
	);
}

export default AuthInfo;

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
			position: 'absolute',
			bottom: 50,
			alignItems: 'center'
		},
		logoContainer: {
			marginBottom: HP(5), 
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(6),
			color: theme.icon,
		},
	})

	return {theme, styles};
}