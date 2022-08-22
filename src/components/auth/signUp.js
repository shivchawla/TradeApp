import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormTextField } from '../form';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

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


const EmailSignUpForm = React.forwardRef(({onSubmit, type, onError, ...props}, ref) => {
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
		<FormView {...props} onSubmit={formik.handleSubmit} >
			<FormTextField field="email" placeholder="Email" handler={formik} setCustomError={onError}/>
			<FormTextField field="password" placeholder="Password" handler={formik} setCustomError={onError}/>
			<FormTextField field="confirmPassword" placeholder="Confirm Password" handler={formik} setCustomError={onError}/>
		</FormView>
	)
})

const PhoneSignUpForm = React.forwardRef(({onSubmit, type, onError, ...props}, ref) => {
	const {theme, styles} = useStyles();

	// console.log("PhoneSignUpForm");
	// console.log(onSubmit);
	// console.log(onSubmit({a:1}));

	const formik = useFormik({
		validationSchema: PhoneSignUpSchema,
		initialValues: { phoneNumber: ''},
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit
	});

	
	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView {...props} onSubmit={formik.handleSubmit} showButton={!!!props.disabled}>
			<FormTextField isPhone={true} field="phoneNumber" type="phone-pad" placeholder="Phone" handler={formik} setCustomError={onError} disabled={props.disabled} instructionText="Enter you phone to receive OTP" />
		</FormView>
	)
})


export const SignUpForm = ({type, ...props}) => {
	return (
		<>{
			type == 'email' ?
				<EmailSignUpForm {...props} />
			:  <PhoneSignUpForm {...props} />
		}</>
	)
}

const useStyles = () => {
	
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
