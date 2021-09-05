import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

const TrustedContactSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last Name is required'),
	email: Yup.string().required('Email address is required')
});

const TrustedContactForm = ({onSubmit, setCustomError,  ...props}) => {

	const manageSubmit = (value, {vqlidateForm, resetForm}) => {
		validateForm();

		onSubmit(values);
	}

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			firstName: '',
			lastName: '',
			email: ''
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: manageSubmit
	});

	return (
		<View style={style.formContainer}>

			<FormTextField key='firstName' placeholder="First Name"  handler={formik} />
			<FormTextField key='lastName' placeholder="Last Name"  handler={formik} />
			<FormTextField key='email' placeholder="Email Address"  handler={formik} />

			<ConfirmButton title="Next" onClick={formik.handleSubmit} />
		</View>
	)
}

const TrustedContact = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		
	}

	const submitIdentity = () => {
		//Save the information in storage
		//And the complete onboarding should be saved in firebase

		navigation.navigate('Disclosure');
	}

	return (
		<AppView title="Add Identity Info" goBack={false}>
			<TrustedContactForm onSubmit={submitIdentity} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default TrustedContact;
