import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { FormView, FormField } from '../form';
import { IdentitySchema } from './meta';

import { ConfirmButton } from '../../components/common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';
import { FormMeta } from './meta';

export const IdentityForm = React.forwardRef(({onSubmit, initialValues, setCustomError,  ...props}, ref) => {

	const {theme, styles} = useStyles();

	const formik = useFormik({
		validationSchema: IdentitySchema,
		initialValues: { 
			firstName: '',
			middleName: '',
			lastName: '',
			dateBirth: '',
			birthCountry: 'Guatemala',
			citizenCountry: 'Guatemala',
			...initialValues
		},
		validateOnChange: false,
   	validateOnBlur: false,
		onSubmit: onSubmit
	});

	//Added this to get ref to formik handleSubmit 
 	React.useImperativeHandle(ref, () => ({submitForm: formik.handleSubmit}), []);
	
	const meta = FormMeta?.['identity']?.meta ?? {};

	return (
	
		<FormView onSubmit={formik.handleSubmit}>
			{Object.keys(meta).map(key => {
				return <FormField key={key} field={key} type={meta[key].type} placeholder={meta[key].title} handler={formik} />
			})}
		</FormView>
	)
});


const useStyles = () => {
	
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		
	});

	return {theme, styles};

}
