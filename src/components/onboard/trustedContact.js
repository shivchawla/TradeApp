import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormTextField } from '../form';

import { useTheme, WP, HP } from '../../theme';

const TrustedContactSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last Name is required'),
	email: Yup.string().email().required('Email address is required')
});

export const TrustedContactForm = React.forwardRef(({onSubmit, initialValues = {}, setCustomError,  ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: TrustedContactSchema,
		initialValues: { 
			firstName: '',
			lastName: '',
			email: '',
			...initialValues
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: onSubmit
	});

	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView onSubmit={formik.handleSubmit}>
			<FormTextField field='firstName' placeholder="First Name"  handler={formik} />
			<FormTextField field='lastName' placeholder="Last Name"  handler={formik} />
			<FormTextField field='email' placeholder="Email Address"  handler={formik} />
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
