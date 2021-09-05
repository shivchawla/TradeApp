import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {AppView, ConfirmButton} from '../../components/common';

const DisclosureSchema = Yup.object().shape({
	isControlPerson: Yup.bool(),
	isAffiliated: Yup.bool(),
	isPolitical: Yup.bool(),
	isFamilyExposed: Yup.bool()
});

const DisclosureForm = ({onSubmit, setCustomError,  ...props}) => {

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			isControlPerson: false,
			isAffiliated: false,
			isPolitical: false,
			isFamilyExposed: false
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

const Disclosure = (props) => {

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
			<DisclosureForm onSubmit={submitIdentity} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Disclosure;
