import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { FormView, FormTextField, CountrySchema, FormCountryField, FormDateField } from '../form';

import {ConfirmButton} from '../../components/common';

import { useTheme, HP, WP } from '../../theme';

const IdentitySchema = Yup.object().shape({
   firstName: Yup.string().required('First Name is required'),
   middleName: Yup.string(),
   lastName: Yup.string().required('Last Name is required'),
   dateBirth: Yup.string().required('Date of Birth '),
   birthCountry: CountrySchema,
   citizenCountry: CountrySchema
});

export const IdentityForm = React.forwardRef(({onSubmit, initialValues, setCustomError,  ...props}, ref) => {

	const {theme, styles} = useStyles();

	// const manageSubmit = async (values, {validateForm, resetForm}) => {
	// 	console.log("Next Submit Button Pressed");
	// 	//After successful validation, call the parent onSubmit
 //    	onSubmit(values);
	// }

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			firstName: '',
			middleName: '',
			lastName: '',
			dateBirth: '',
			birthCountry: 'Guatemala',
			citizenCountry: 'Guatemala',
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
			<FormTextField field="firstName" placeholder="First Name" handler={formik} />
			<FormTextField field="middleName" placeholder="Middle Name" handler={formik} />
			<FormTextField field="lastName" placeholder="Last Name" handler={formik} />
			
			<FormDateField field="dateBirth" placeholder="Date of Birth" handler={formik} />
			
			<FormCountryField field="birthCountry" placeholder="Country of Birth" handler={formik} />

			<FormCountryField field="citizenCountry" placeholder="Country of Citizenship" handler={formik} />
		</FormView>

	)

});

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		
	});

	return {theme, styles};

}
