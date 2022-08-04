import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { FormView, FormTextField } from '../form';
import { useTheme, WP, HP } from '../../theme';
import { TinyTextButton } from '../../components/common';

const ForgotPasswordSchema = Yup.object().shape({
   email: Yup.string().email('Please enter valid email').required('Email is required')
});

export const ForgotPasswordForm = React.forwardRef(({onSubmit, onError, ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: ForgotPasswordSchema,
		initialValues: { email: 'shivchawla2001@gmail.com'},
		validateOnChange: false,
        validateOnBlur: false,
		onSubmit: onSubmit
	});

	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);
 	
 	const navigation = useNavigation();

	return (
		<FormView {...props} onSubmit={formik.handleSubmit}>
			<FormTextField field="email" placeholder="Email" handler={formik} setCustomError={onError}/>
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		tinyButtonContainer: {
			width: '90%',
			alignItems: 'flex-end',
			marginTop: -15,
		}
	});

	return {theme, styles};

}