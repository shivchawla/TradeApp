import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { FormView, FormTextField } from '../form';
import { useTheme } from '../../theme';
import { TinyTextButton } from '../../components/common';

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
		initialValues: { email: 'shivchawla2001@gmail.com', password: 'Password'},
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
			<FormTextField field="password" placeholder="Password" handler={formik} setCustomError={onError}/>
			<View style={styles.tinyButtonContainer}>
	   		<TinyTextButton 
	   			title="Forgot Password ?" 
	   			onPress={() => navigation.navigate('ForgotPassword')}
	   			buttonTextStyle={{fontSize: WP(3.5), color: theme.grey5}}
   			/>
   		</View>
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		tinyButtonContainer: {
			width: '90%',
			alignItems: 'flex-end',
			marginTop: -15,
		}
	});

	return {theme, styles};

}