import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormTextField } from '../form';
import { useTheme, WP, HP, StyledText } from '../../theme';

const EmailSignUpSchema = Yup.object().shape({
   email: Yup.string().email('Please enter valid email').required('Email is required'),
   password: Yup.string()
    		.min(8, ({ min }) => `Password must be at least ${min} characters`)
    		.required('Password is required'),
 	confirmPassword: Yup.string()
    		.oneOf([Yup.ref('password'), null], 'Passwords must match')
    		.required('Password is required'),
 });

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const PhoneSignUpSchema = Yup.object().shape({
   phoneNumber: Yup.string().matches(phoneRegExp, "Please enter a valid phone number").required('Phone is required')
 });


const EmailSignUpForm = React.forwardRef(({onSubmit, type, onSigupError, error,  ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: EmailSignUpSchema,
		initialValues: { email: 'shivchawla2001@gmail.com', password: 'Password', confirmPassword: 'Password' },
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit
	});

	
	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView {...{error}} onSubmit={formik.handleSubmit}>
			<FormTextField field="email" placeholder="Email" handler={formik} setCustomError={onSigupError}/>
			<FormTextField field="password" placeholder="Password" handler={formik} setCustomError={onSigupError}/>
		</FormView>
	)
})

const PhoneSignUpForm = React.forwardRef(({onSubmit, type, onSignupError, error,  ...props}, ref) => {
	const {theme, styles} = useStyles();

	// console.log("PhoneSignUpForm");
	// console.log(onSubmit);
	// console.log(onSubmit({a:1}));

	const formik = useFormik({
		validationSchema: PhoneSignUpSchema,
		initialValues: { phoneNumber: '+50240428803'},
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit
	});

	
	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView {...{error}} onSubmit={formik.handleSubmit}>
			<FormTextField field="phoneNumber" type="phone-pad" placeholder="Phone" handler={formik} setCustomError={onSignupError}/>
		</FormView>
	)
})


export const SignUpForm = ({type, ...props}) => {
	console.log(type);
	return (
		<>{
			type == 'email' ?
				<EmailSignUpForm {...props} />
			:  <PhoneSignUpForm {...props} />
		}</>
	)
}

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
