import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BottomPicker } from '../common';

import { useTheme, StyledText, WP, HP }  from '../../theme';
import { BANK_CURRENCIES, SUPPORTED_BANKS, BANK_ACCOUNT_TYPES} from '../../config';

const DepositSchema = Yup.object().shape({
   accountNumber: Yup.string().required('Account Number is required'),
   confirmAccountNumber: Yup.string().oneOf([Yup.ref('accountNumber')], 'Account Number must match').required('Confirm Account Number is required'),
   accountType: Yup.string(),
   bankName: Yup.string(),
   currency: Yup.string(),
   amount: Yup.number().test('check-amount', '', function(value, {createError, path}) {
     	const currency = this.parent.currency;
     	
     	if ((currency === 'USD' && value < 200) || 
      	(currency === 'GTQ' && value < 150000)) {
     		return createError({
            message: `Minimun Deposit of ${currency} ${currency == 'USD' ? 200 : 1500}`,
            path
			});
  		}

  		if ((currency === 'USD' && value > 20000) || 
      	(currency === 'GTQ' && value > 160000)) {
     		return createError({
            message: `Maximum Deposit of ${currency} ${currency == 'USD' ? 20000 : 150000}`,
            path
			});
  		}

  		return true;

    }).required('Amount Is Required')
})

export const DepositForm = ({onSubmit, setCustomError,  ...props}) => {

	const {theme, styles} = useStyles();
	
	const accountNumRef = useRef(null);
	const confirmAccountNumRef = useRef(null);

	const checkAmount = (text) => {
		return text.match(/^[1-9]\d*$/g) ? text : text.slice(0,-1);
	}

	const manageSubmit = async (values, {validateForm, resetForm}) => {
		validateForm(values);
		//After successful validation, call the parent onSubmit
    	onSubmit(values);
	}

	const formik = useFormik({
		validationSchema: DepositSchema,
		initialValues: { 
			// name: '', 
			accountNumber: '', 
			confirmAccountNumber: '', 
			accountType: '', 
			bankName: '', 
			currency: BANK_CURRENCIES[0].key
		},
		validateOnChange: false,
      validateOnBlur: false,
		onSubmit: manageSubmit
	});

	const { handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors} = formik;

	const selectedBank = SUPPORTED_BANKS.find(item => item.key == values.bankName); 
	const selectedAccountType = BANK_ACCOUNT_TYPES.find(item => item.key == values.accountType);


	return (
		<View style={styles.formContainer}>
			{/*<TextInput style={[styles.textInput, styles.nameInput]}
				placeholder="Full Name"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('name')}
				onBlur={handleBlur('name')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => accountNumRef.current?.focus()}
				autoCompleteType="off"
				value={values.name}
			/>
			{errors.name && touched.name && <StyledText style={styles.errorText}>{errors.name}</StyledText>}
		*/}	
			<TextInput style={[styles.textInput, styles.passwordInput]}
				ref={accountNumRef}
				placeholder="Account Number"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('accountNumber')}
				onBlur={handleBlur('accountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => confirmAccountNumRef.current?.focus()}
				autoCompleteType="off"
				value={values.accountNumber}
			/>
			{errors.accountNumber && <StyledText style={styles.errorText}>{errors.accountNumber}</StyledText>}

			<TextInput style={[styles.textInput, styles.passwordInput]}
				ref={confirmAccountNumRef}
				placeholder="Confirm Account Number"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('confirmAccountNumber')}
				onBlur={handleBlur('confirmAccountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				autoCompleteType="off"
				value={values.confirmAccountNumber}
			/>
			{errors.confirmAccountNumber && <StyledText style={styles.errorText}>{errors.confirmAccountNumber}</StyledText>}

			<BottomPicker 
				items={SUPPORTED_BANKS} 
				selectedValue={selectedBank || {title: 'Select your bank '}} 
				onSelect={(item) => handleChange('bankName')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={[styles.pickerViewValue, {...!selectedBank && {color: theme.grey7}}]} />

			<BottomPicker 
				items={BANK_ACCOUNT_TYPES} 
				selectedValue={selectedAccountType || {title: 'Select Account Type'}} 
				onSelect={(item) => handleChange('accountType')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={[styles.pickerViewValue, {...!selectedAccountType && {color: theme.grey7}}]} />

			<BottomPicker 
				items={BANK_CURRENCIES} 
				selectedValue={BANK_CURRENCIES.find(item => item.key == values.currency)} 
				onSelect={(item) => handleChange('currency')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={styles.pickerViewValue} />

			<TextInput style={[styles.textInput, styles.amountInput]}
				keyboardType="number-pad"
				placeholder="Amount"
				placeholderTextColor={theme.grey5}
				onChangeText={(text) => handleChange('amount')(checkAmount(text))}
				onBlur={handleBlur('amount')}
				onFocus={() => {setErrors({}); setCustomError();}}
				autoCompleteType="off"
				value={values.amount}
			/>
			{errors.amount && <StyledText style={styles.errorText}>{errors.amount}</StyledText>}
			
			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<StyledText style={styles.submitButtonText}>NEXT</StyledText> 
			</TouchableOpacity>
		</View>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		formikContainer: {
			justifyContent: 'center', 
			textAlign: 'center', 
			flex:1, 
			width: '100%',
			marginTop: HP(5)
		},
		formContainer: {
			alignItems: 'center',
		},
		textInput: {
			borderWidth: 1,
			borderColor: theme.grey5,
			width: '90%',
			color: theme.text,
			marginBottom: 20,
			backgroundColor: theme.background,
			paddingLeft:20
		},
		submitButton: {
			backgroundColor: 'white',
			padding: 5,
			paddingLeft: 20,
			paddingRight: 20
		},
		submitButtonText: {
			fontSize: 16,
			fontWeight: '600'
		},
		errorText: {
			marginTop: -15,
			textAlign:'left',
			width: '90%',
			marginBottom: 10,
			color: 'red'
		},

		signInError: {
			textAlign:'center',
			// width: '90%',
			marginBottom: 50,
			color: 'red'
		},

		pickerView: {
			width: '90%', 
			alignItems: 'center', 
			borderWidth:1, 
			borderColor: theme.grey5, 
			height:50,
			paddingLeft: WP(4),
			paddingRight: WP(4), 
			justifyContent:'space-between', 
			marginBottom: HP(3)
		},

		pickerViewValue: {
			fontSize: WP(4.5)
		}

	});

	return {theme, styles};
}
