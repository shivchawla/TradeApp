import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

const ContactSchema = Yup.object().shape({
	addressLine1: Yup.string().required('Address is required'),
	addressLine2: Yup.string(),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	postalCode: Yup.string().required('Postal Code is required'),
	country: Yup.string().required('Country is required')
});

const ContactForm = ({onSubmit, setCustomError,  ...props}) => {

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			postalCode: '',
			country: ''
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: manageSubmit
	});

	const { handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors} = formik;

	return (
		<View style={style.formContainer}>

			<TextInput style={[styles.textInput, styles.nameInput]}
				ref={firstNameRef}
				placeholder="First Name"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('accountNumber')}
				onBlur={handleBlur('accountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => confirmAccountNumRef.current?.focus()}
				autoCompleteType="off"
				value={values.accountNumber}
			/>

			<TextInput style={[styles.textInput, styles.nameInput]}
				ref={middleNameRef}
				placeholder="Middle Name"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('accountNumber')}
				onBlur={handleBlur('accountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => confirmAccountNumRef.current?.focus()}
				autoCompleteType="off"
				value={values.accountNumber}
			/>

			<TextInput style={[styles.textInput, styles.nameInput]}
				ref={lastNameRef}
				placeholder="Last Name"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('accountNumber')}
				onBlur={handleBlur('accountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => confirmAccountNumRef.current?.focus()}
				autoCompleteType="off"
				value={values.accountNumber}
			/>

			<ConfirmButton title="Next" onClick={onSubmit}/>
		</View>
	)
}

const Contact = (props) => {

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
			<ContactForm onSubmit={submitIdentity} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Contact;
