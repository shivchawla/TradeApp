import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

import { useTheme, StyledText, WP, HP }  from '../../theme';
import { useAuth } from '../../helper';

const ChangePasswordSchema = Yup.object().shape({
   password: Yup.string()
    		.required('Password is required'),

   newPassword: Yup.string()
    		.min(8, ({ min }) => `Password must be at least ${min} characters`)
    		.required('Password is required') 		
 });

const ChangePasswordForm = ({ handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors, setAuthError}) => {
	
	// const password = useRef(null);
	// const newPassword = useRef(null);
	const {theme, styles} = useStyles();

	return (
		<View style={styles.formContainer}>
			
			<TextInput style={[styles.textInput, styles.passwordInput]}
				type="password"
				placeholder="Password"
				placeholderTextColor={theme.grey8}
				onChangeText={handleChange('password')}
				onBlur={handleBlur('password')}
				onFocus={() => {setErrors({}); setAuthError();}}
				value={values.password}
			/>
			{errors.password && touched.password && <StyledText style={styles.errorText}>{errors.password}</StyledText>}

			<TextInput style={[styles.textInput, styles.passwordInput]}
				type="password"
				placeholder="New Password"
				placeholderTextColor={theme.grey8}
				onChangeText={handleChange('newPassword')}
				onBlur={handleBlur('newPassword')}
				onFocus={() => {setErrors({}); setAuthError();}}
				value={values.newPassword}
			/>
			{errors.newPassword && touched.newPassword && <StyledText style={styles.errorText}>{errors.newPassword}</StyledText>}
			<TouchableOpacity style={styles.submitButton} onPressOut={handleSubmit}>
				<StyledText style={styles.submitButtonText}>UPDATE PASSWORD</StyledText> 
			</TouchableOpacity>
		</View>
	)
}


//Add logic to save auth state to temp storage
const ChangePassword = (props) => {

	const {styles} = useStyles();

	const [error , setError] = useState(null);

	const {navigation} = props;

	const {changePassword} = useAuth();
	
	const onChangePassword = async (password, newPassword) => {
		console.log("onResetPassword Pressed")
		
		try {
			await changePassword(password, newPassword);			
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

		  	//This code should not come
		  	if (error.code == "auth/requires-recent-login") {
		  		setError("Internal Error! Please contact Customer care!");
		  	}

		  	//My error
		  	if (error.code == "auth/email-not-verified") {
		  		setError("Accout has been disabled. Please contact Customer care!");	
		  	}
		}
	}
		
	const changePasswordMsg = "Password changed successfully!!";

	const onSubmit = async (values, {validateForm, resetForm}) => {
		validateForm(values);
		await onChangePassword(values.password, values.newPassword);
       	resetForm();
	}

	const formik = useFormik({
		validationSchema: ChangePasswordSchema,
		initialValues: { password: '', newPassword: '' },
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit: onSubmit
	});

	return (
		<AppView title="Change Password">
			<View style={styles.formikContainer}>
			{error && <StyledText style={styles.authError}>{error} </StyledText>}
			<ChangePasswordForm {...formik} setAuthError={setError} />
		   </View>
	   </AppView>
	);
}

export default ChangePassword;


const useStyles = () => {

	const {theme} = useTheme();

	const styles = StyleSheet.create({
		formikContainer: {
			justifyContent: 'center', 
			textAlign: 'center', 
			flex:1, 
			width: '100%',
			marginTop: HP(20),
		},
		formContainer: {
			alignItems: 'center',
		},
		textInput: {
			borderWidth: 1,
			width: '90%',
			color: 'black',
			marginBottom: 20,
			backgroundColor: theme.grey4,
			paddingLeft:20
		},
		submitButton: {
			backgroundColor: theme.icon,
			padding: 5,
			paddingLeft: 20,
			paddingRight: 20,
			marginTop: HP(10)
		},
		submitButtonText: {
			fontSize: 16,
			fontWeight: '600',
			color: theme.black
		},
		errorText: {
			marginTop: -15,
			textAlign:'left',
			width: '80%',
			marginBottom: 10,
			color: 'red'

		},
		authError: {
			textAlign:'center',
			marginBottom: 50,
			color: 'red'
		}

	});

	return {theme, styles};
}
