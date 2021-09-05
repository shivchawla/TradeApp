import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

const IdentitySchema = Yup.object().shape({
	idType: '',
	idNumber: '',
	idCountry: ''
			
   taxId: Yup.string().required('First Name is required'),
   taxCountry: Yup.string().required('Country of Tax')
});

const IdentityForm = ({onSubmit, setCustomError,  ...props}) => {

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			firstName: '', 
			middleName: '', 
			lastName: '', 
			dateBirth: '', 
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

const Identity2 = (props) => {

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
			<IdentityForm onSubmit={submitIdentity} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Identity;
