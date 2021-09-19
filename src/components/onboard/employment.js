import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormBottomPicker, FormTextField, 
	FormCountryField, CountrySchema } from '../form';

import { useTheme, WP, HP } from '../../theme';

const EmploymentSchema = Yup.object().shape({
	employmentStatus: Yup.string().required('Employment Status is required'),
	employerName: Yup.string().required("Employer Name is requied"),
	employmentPosition: Yup.string().required("Employment Position is required"),

	employerAddress: Yup.object().shape({
		addressLine1: Yup.string().required('Address is required'),
		city: Yup.string().required('City is required'),
		state: Yup.string().required('State is required'),
		postalCode: Yup.string().required('Postal Code is required'),
		country: CountrySchema
	})
});

const EMPLOYMENT_POSITIONS = [
	{key:'unemployed', title: 'Unemployment' },
	{key:'employed', title: 'Employed' },
	{key:'student', title: 'Student' },
	{key:'retired', title: 'Retired' },
];

export const EmploymentForm = React.forwardRef(({onSubmit, initialValues = {}, setCustomError,  ...props}, ref) => {
	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: EmploymentSchema,
		initialValues: { 
			employmentStatus: '',
			employerName: '',
			employmentPosition: '',

			employerAddress: {
				addressLine1: '',
				city: 'Guatemala City',
				state: 'Guatemala',
				postalCode: '01001',
				country: 'Guatemala',
			},
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
			<FormBottomPicker 
				field="employmentStatus" 
				items={EMPLOYMENT_POSITIONS} 
				placeholder="Employment Status"
				handler={formik} />

			<FormTextField 
				field="employerName" 
				placeholder="Employer Name" 
				handler={formik} />

			<FormTextField 
				field="employmentPosition" 
				placeholder="Employment Position" 
				handler={formik} />

			<FormTextField 
				field="employerAddress.addressLine1" 
				placeholder="Address Line 1" 
				handler={formik} />
			
			<FormTextField 
				field="employerAddress.city" 
				placeholder="City" 
				handler={formik}/>

			<FormTextField 
				field="employerAddress.state" 
				placeholder="State" 
				handler={formik}/>

			<FormTextField 
				field="employerAddress.postalCode" 
				placeholder="Postal Code" 
				handler={formik}/>

			<FormCountryField 
				field="employerAddress.country" 
				placeholder="Country" 
				handler={formik}/>


		</FormView>
	)
})

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
	});

	return {theme, styles};

}
