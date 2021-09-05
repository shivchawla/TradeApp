import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AppView, ConfirmButton } from '../../components/common';
import { FormTextField, CountrySchema, FormCountryField } from '../../components/forms';

import { useTheme, HP, WP } from '../../theme';

const IdentitySchema = Yup.object().shape({
   firstName: Yup.string().required('First Name is required'),
   middleName: Yup.string(),
   lastName: Yup.string().required('Last Name is required'),
   dateBirth: Yup.string().required('Date of Birth '),
   birthCountry: CountrySchema,
   idType: Yup.string().required('Identification type is required '),
   idNumber: Yup.string().required('Identification number is required'),
   idCountry: CountrySchema
});

const IdentityForm = ({onSubmit, setCustomError, formik,  ...props}) => {

	const {theme, styles} = useStyles();

	return (
		<View style={styles.formContainer}>
			<FormTextField field="firstName" placeholder="First Name" handler={formik} />
			<FormTextField field="middleName" placeholder="Middle Name" handler={formik} />
			<FormTextField field="lastName" placeholder="Last Name" handler={formik} />
			<FormTextField field="dateBirth" placeholder="Date of Birth" handler={formik} />
			
			<FormCountryField field="birthCountry" handler={formik} />
			
			<ConfirmButton title="Next" onClick={formik.handleSubmit}/>
		</View>
	)
}

const Identity = (props) => {

	const {navigation} = props;

	const manageSubmit = async (values, {validateForm, resetForm}) => {
		validateForm(values);

		//After successful validation, call the parent onSubmit
    	onSubmit(values);
	}

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			firstName: '',
			middleName: '',
			lastName: '',
			dateBirth: '',
			birthCountry: {code: 'GT', name: 'Guatemala'},
			// citizenCountry: {code: 'GT', name: 'Guatemala'} 
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: manageSubmit
	});


	const toNextScreen = () => {
		
	}

	const submitIdentity = (values) => {
		//Save the information in storage
		//And the complete onboarding should be saved in firebase
		console.log("Submit Identity Pressed");
		console.log(values);

		// navigation.navigate('Disclosure');
	}



	return (
		<AppView title="Add Identity Info">
			<IdentityForm {...{formik}} onSubmit={submitIdentity} />
		</AppView>
	);
}

const useStyles = () => {
	
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		formContainer: {
			justifyContent: 'center', 
			alignItems: 'center',
			width: '100%',
			marginTop: HP(5)
		},
	});

	return {theme, styles};

}

export default Identity;
