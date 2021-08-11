import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';
import { useAuth } from '../../helper';

const SigninSchema = Yup.object().shape({
   email: Yup.string().email('Please enter valid email').required('Email is required'),
   password: Yup.string()
    		.min(8, ({ min }) => `Password must be at least ${min} characters`)
    		.required('Password is required'),

 });

const SignInForm = ({ handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors, setSignInError}) => {
	console.log("SignInForm Props");
	// console.log(handleChange);
	// console.log(handleBlur);
	// console.log(handleSubmit);
	console.log(values);
	console.log(errors);

	const password = useRef(null);

	return (
		<View style={styles.formContainer}>
			<StyledTextInput style={[styles.textInput, styles.emailInput]}
				type="email"
				placeholder="Email"
				placeholderTextColor='black'
				onChangeText={handleChange('email')}
				onBlur={handleBlur('email')}
				onFocus={() => {setErrors({}); setSignInError();}}
				onSubmitEditing={() => password.current?.focus()}
				value={values.email}
			/>
			{errors.email && touched.email && <StyledText style={styles.errorText}>{errors.email}</StyledText>}
			<StyledTextInput style={[styles.textInput, styles.passwordInput]}
				type="password"
				ref={password}
				placeholder="Password"
				placeholderTextColor='black'
				onChangeText={handleChange('password')}
				onBlur={handleBlur('password')}
				onFocus={() => {setErrors({}); setSignInError();}}
				value={values.password}
			/>
			{errors.password && touched.password && <StyledText style={styles.errorText}>{errors.password}</StyledText>}
			<Pressable style={styles.submitButton} onPressOut={handleSubmit}>
				<StyledText style={styles.submitButtonText}>SIGN IN</StyledText> 
			</Pressable>
		</View>
	)
}


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
		validateForm(values);
		await onSignIn(values.email, values.password);
       	resetForm();
	}

	const formik = useFormik({
		validationSchema: SigninSchema,
		initialValues: { email: '', password: '' },
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit: onSubmit
	});

	return (
		<AppView title="SIGN IN" headerTitleStyle={{color: 'white'}} goBack={false}>
			<View style={styles.formikContainer}>
			{error && <StyledText style={styles.signInError}>{error} </StyledText>}
			<SignInForm {...formik} setSignInError={setError} />
		   </View>
	   </AppView>
	);
}

export default SignIn;


{/*<AppView title="Sign In" goBack={false}>
		    {!!!currentUser ? 
	    		<ConfirmButton title="Sign In" onClick={() => onSignIn({email: "shiv.chawla@yandex.com", password: "Fincript"})} />
		    : <StyledText>{signInMsg}</StyledText>}
		</AppView>
*/}

const styles = StyleSheet.create({
	formikContainer: {
		justifyContent: 'center', 
		textAlign: 'center', 
		flex:1, 
		width: '100%',
	},
	formContainer: {
		alignItems: 'center',
	},
	textInput: {
		borderWidth: 1,
		width: '80%',
		color: 'black',
		marginBottom: 20,
		backgroundColor: 'white',
		paddingLeft:20
	},
	submitButton: {
		backgroundColor: 'white',
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: '600'
	},
	errorText: {
		marginTop: -15,
		textAlign:'left',
		width: '80%',
		marginBottom: 10,
		color: 'red'

	},

	signInError: {
		textAlign:'center',
		// width: '80%',
		marginBottom: 50,
		color: 'red'
	}

});