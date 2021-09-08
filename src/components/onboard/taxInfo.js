import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormDateField, FormTextField, 
	FormBottomPicker, FormCountryField, CountrySchema } from '../form';

import { useTheme, WP, HP } from '../../theme';

const TaxInfoSchema = Yup.object().shape({
	idType: Yup.string().required('Identification type is required'),
	idNumber: Yup.string().required('Identification number is required'),
	idCountry: CountrySchema,
			
	taxId: Yup.string().required('Tax ID is required'),
	taxCountry: CountrySchema,

	fundSource: Yup.string().required('Funding Source required')
});

const FUND_SOURCES = [
	{key: 'employment_income', title: 'Employment Income'},
	{key: 'investments', title: 'Investments'},
	{key: 'inheritance', title: 'Inheritance'},
	{key: 'business_income', title: 'Business Income'},
	{key: 'savings', title: 'Savings'},
	{key: 'family', title: 'Family'},
];


export const TaxInfoForm = React.forwardRef(({onSubmit, initialValues = {}, setCustomError,  ...props}, ref) => {

	const formik = useFormik({
		validationSchema: TaxInfoSchema,
		initialValues: { 
			idType: '', 
			idNumber: '', 
			idCountry: 'Guatemala', 
			taxIdType: 'GTM_NIT',
			taxId: '',
			taxCountry: 'Guatemala',
			fundSource: '',
			...initialValues
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: onSubmit
	});

	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	const {theme, styles} = useStyles();

	const idDocuments = [{key: 'dpi', title: 'DPI'}, {key: 'passport', title: 'Passport'}];

	return (
		<FormView onSubmit={formik.handleSubmit}>
			<FormBottomPicker field="idType" items={idDocuments} placeholder="Identification Document" handler={formik} />
			
			<FormTextField field="idNumber" placeholder="Identification Number" handler={formik} />
			<FormCountryField field="idCountry" placeholder="Select ID Country" handler={formik} />
			
			<FormTextField field="taxId" placeholder="Tax Identification" handler={formik} />
			<FormCountryField field="idCountry" placeholder="Tax Country" handler={formik} />
			
			<FormBottomPicker field="fundSource" items={FUND_SOURCES} placeholder="Source of Funds" handler={formik} />		
		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
