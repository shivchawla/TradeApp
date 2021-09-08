import React, {useState, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { TouchRadioGroup } from '../common'
import { FormView, FormBooleanField } from '../form';
import { useTheme, WP, HP } from '../../theme';

const DisclosureSchema = Yup.object().shape({
	isControlPerson: Yup.string().oneOf(["YES", "NO"]),
	isAffiliated: Yup.string().oneOf(["YES", "NO"]),
	isPolitical: Yup.string().oneOf(["YES", "NO"]),
	isFamilyExposed: Yup.string().oneOf(["YES", "NO"])
});

export const DisclosureForm = React.forwardRef(({onSubmit, initialValues = {}, setCustomError,  ...props}, ref) => {

	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: DisclosureSchema,
		initialValues: { 
			isControlPerson: 'NO',
			isAffiliated: 'NO',
			isPolitical: 'NO',
			isFamilyExposed: 'NO',
			...initialValues
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit
	});

	
	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);

	return (
		<FormView onSubmit={formik.handleSubmit} formContainerStyle={{alignItems: 'flex-start'}}>

			<FormBooleanField 
				field="isControlPerson" 
				title="Are you a control person"
				handler={formik} 
			/>

			<FormBooleanField 
				field="isAffiliated" 
				title="Are you a control person"
				handler={formik} 
			/>

			<FormBooleanField 
				field="isPolitical" 
				title="Are you a control person"
				handler={formik} 
			/>

			<FormBooleanField 
				field="isFamilyExposed" 
				title="Are you a control person"
				handler={formik} 
			/>

		</FormView>
	)
})

const useStyles = () => {

	const {theme} = useTheme();

	const styles = StyleSheet.create({

	});

	return {theme, styles}
}
