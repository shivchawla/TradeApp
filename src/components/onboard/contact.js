import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormDateField, FormTextField, FormCountryField, CountrySchema } from '../form';
import { useTheme, WP, HP } from '../../theme';

const ContactSchema = Yup.object().shape({
	addressLine1: Yup.string().required('Address is required'),
	addressLine2: Yup.string(),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	postalCode: Yup.string().required('Postal Code is required'),
	country: ContactSchema
});

export const ContactForm = React.forwardRef(({onSubmit, initialValues = {}, setCustomError,  ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: ContactSchema,
		initialValues: { 
			addressLine1: '',
			addressLine2: '',
			city: 'Guatemala City',
			state: 'Guatemala',
			postalCode: '01001',
			country: 'Guatemala',
			...initialValues
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit
	});
	
	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView onSubmit={formik.handleSubmit}>
			<FormTextField field="addressLine1" placeholder="Address Line 1" handler={formik} />
			<FormTextField field="addressLine2" placeholder="Address Line 2" handler={formik} />
			<FormTextField field="city" placeholder="City" handler={formik} />
			<FormTextField field="state" placeholder="State" handler={formik} />
			<FormTextField field="postalCode" placeholder="Postal Code" handler={formik} />
			<FormCountryField field="country" placeholder="Country" handler={formik} />
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
