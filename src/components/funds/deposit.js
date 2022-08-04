import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormTextField, FormBottomPicker } from '../form';

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

export const DepositForm = ({onSubmit, onError, ...props}) => {

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

	const selectedBank = SUPPORTED_BANKS.find(item => item.key == formik.values.bankName); 
	const selectedAccountType = BANK_ACCOUNT_TYPES.find(item => item.key == formik.values.accountType);

	return (
		<FormView {...props} onSubmit={formik.handleSubmit}>
			<FormTextField field="accountNumber" placeholder="Account Number" handler={formik} setCustomError={onError}/>
			<FormTextField  field="confirmAccountNumber" placeholder="Confirm Account Number" handler={formik} setCustomError={onError}/>
			<FormBottomPicker field="bankName" items={SUPPORTED_BANKS} placeholder="Select your bank" handler={formik} setCustomError={onError}/>
			<FormBottomPicker field="accountType" items={BANK_ACCOUNT_TYPES} placeholder="Select Account Type" handler={formik} setCustomError={onError}/>
			<FormBottomPicker field="currency" items={BANK_CURRENCIES} placeholder="Select Currency" handler={formik} setCustomError={onError}/>
			<FormTextField type="numeric" field="amount" placeholder="Amount" handler={formik} setCustomError={onError}/>
			
		</FormView>
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
