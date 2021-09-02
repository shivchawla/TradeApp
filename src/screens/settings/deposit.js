import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AppView, ConfirmButton, BottomPicker, TinyTextButton } from '../../components/common';

import { useTheme, StyledText, WP, HP }  from '../../theme';
import { BANK_CURRENCIES, SUPPORTED_BANKS, BANK_ACCOUNT_TYPES} from '../../config';


const DepositSchema = Yup.object().shape({
   name: Yup.string().required('Name is required'),
   accountNumber: Yup.string().required('Account Number is required'),
   confirmAccountNumber: Yup.string().oneOf([Yup.ref('accountNumber')], 'Account Number must match').required('Confirm Account Number is required'),
   accountType: Yup.string(),
   bankName: Yup.string(),
   currency: Yup.string(),
   amount: Yup.number().test('check-amount', '', function(value, {createError, path}) {
     	const currency = this.parent.currency;
     	if (!value && value != 0 ) {
     		return createError({
            message: `Amount is required`,
            path
          });
     	}

     	if ((currency === 'USD' && value < 200) || 
      	(currency === 'GTQ' && value < 1500)) {
     	return createError({
            message: `Minimun Deposit of ${currency} ${currency == 'USD' ? 200 : 1500} is required`,
            path
          });
  		}

  		return true;

    }).required('Amount is required')
})

const DepositForm = ({ handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors, setCustomError}) => {
	// console.log("DepositForm Props");
	// console.log(handleChange);
	// console.log(handleBlur);
	// console.log(handleSubmit);
	// console.log(values);
	// console.log(errors);

	const {theme, styles} = useStyles();
	
	const accountNumRef = useRef(null);
	const confirmAccountNumRef = useRef(null);

	return (
		<View style={styles.formContainer}>
			<TextInput style={[styles.textInput, styles.nameInput]}
				type="text"
				placeholder="Full Name"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('name')}
				onBlur={handleBlur('name')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => accountNumRef.current?.focus()}
				value={values.name}
			/>
			{errors.name && touched.name && <StyledText style={styles.errorText}>{errors.name}</StyledText>}
			
			<TextInput style={[styles.textInput, styles.passwordInput]}
				type="text"
				ref={accountNumRef}
				placeholder="Account Number"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('accountNumber')}
				onBlur={handleBlur('accountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				onSubmitEditing={() => confirmAccountNumRef.current?.focus()}
				value={values.accountNumber}
			/>
			{errors.accountNumber && touched.accountNumber && <StyledText style={styles.errorText}>{errors.accountNumber}</StyledText>}

			<TextInput style={[styles.textInput, styles.passwordInput]}
				type="password"
				ref={confirmAccountNumRef}
				placeholder="Confirm Account Number"
				placeholderTextColor={theme.grey7}
				onChangeText={handleChange('confirmAccountNumber')}
				onBlur={handleBlur('confirmAccountNumber')}
				onFocus={() => {setErrors({}); setCustomError();}}
				value={values.confirmAccountNumber}
			/>
			{errors.confirmAccountNumber && touched.confirmAccountNumber && <StyledText style={styles.errorText}>{errors.confirmAccountNumber}</StyledText>}

			<BottomPicker 
				items={SUPPORTED_BANKS} 
				selectedValue={SUPPORTED_BANKS.find(item => item.key == values.bankName)} 
				onSelect={(item) => handleChange('bankName')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={styles.pickerViewValue} />

			<BottomPicker 
				items={BANK_ACCOUNT_TYPES} 
				selectedValue={BANK_ACCOUNT_TYPES.find(item => item.key == values.accountType)} 
				onSelect={(item) => handleChange('accountType')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={styles.pickerViewValue} />

			<BottomPicker 
				items={BANK_CURRENCIES} 
				selectedValue={BANK_CURRENCIES.find(item => item.key == values.currency)} 
				onSelect={(item) => handleChange('currency')(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={styles.pickerViewValue} />

			<TextInput style={[styles.textInput, styles.amountInput]}
				type="number"
				placeholder="Amount"
				placeholderTextColor={theme.grey5}
				onChangeText={handleChange('amount')}
				onBlur={handleBlur('amount')}
				onFocus={() => {setErrors({}); setCustomError();}}
				value={values.amount}
			/>
			{errors.amount && touched.amount && <StyledText style={styles.errorText}>{errors.amount}</StyledText>}
			
			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<StyledText style={styles.submitButtonText}>NEXT</StyledText> 
			</TouchableOpacity>
		</View>
	)
}


//Add logic to save auth state to temp storage
const CreateDeposit = (props) => {

	const {theme, styles} = useStyles();
	const [error , setError] = useState(null);
	const {navigation} = props;

	const [showForm, setShowForm] = useState(true);
		
	const signInMsg = "Successfully signed in!";

	const [depositSummary, setDepositSummary] = useState(null)

	const onSubmit = async (values, {validateForm, resetForm}) => {
		validateForm(values);
		// await onSignIn(values.email, values.password);
    	// resetForm();
    	setDepositSummary(values);
	}

	const formik = useFormik({
		validationSchema: DepositSchema,
		initialValues: { 
			name: '', 
			accountNumber: '', 
			confirmAccountNumber: '', 
			accountType: BANK_ACCOUNT_TYPES[0].key, 
			bankName: SUPPORTED_BANKS[0].key, 
			currency: BANK_CURRENCIES[0].key
		},
		validateOnChange: false,
      validateOnBlur: false,
		onSubmit: onSubmit
	});

	const {currency, amount, bankName, accountType} =  depositSummary || {};
	return (
		<AppView title="CREATE DEPOSIT" headerTitleStyle={{color: 'white'}}>
			{!depositSummary && 
				<View style={styles.formikContainer}>
					{error && <StyledText style={styles.signInError}>{error} </StyledText>}
					<DepositForm {...formik} setCustomError={setError} />
			   </View>
			}
			{depositSummary && 
				<>
					<View style={styles.depositSummary}>
						<StyledText>You have agreed to deposit {currency} {amount}</StyledText>
						<StyledText>Selected Bank: {SUPPORTED_BANKS.find(item => item.key == bankName)?.title || ''}</StyledText>
						<StyledText>Account Type: {BANK_ACCOUNT_TYPES.find(item => item.key == accountType)?.title}</StyledText>
					</View>
					<TinyTextButton onPress={() => setDepositSummary(null)} title="Edit" />	
					
				</>

			}
	   </AppView>
	);
}

export default CreateDeposit;

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