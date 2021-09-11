import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormTextField } from '../form';
import { useTheme, WP, HP } from '../../theme';

const SigninSchema = Yup.object().shape({
   email: Yup.string().email('Please enter valid email').required('Email is required'),
   password: Yup.string()
		.min(8, ({ min }) => `Password must be at least ${min} characters`)
		.required('Password is required'),
});

export const SignInForm = React.forwardRef(({onSubmit, onError, ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: SigninSchema,
		initialValues: { email: 'shiv.chawla@yandex.com', password: 'Password'},
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit: onSubmit
	});

	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView {...props} onSubmit={formik.handleSubmit}>
			<FormTextField field="email" placeholder="Email" handler={formik} setCustomError={onError}/>
			<FormTextField field="password" placeholder="Password" handler={formik} setCustomError={onError}/>
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}