import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

import { useTheme, WP, HP } from '../../theme';

export const FormTextField = ({field, placeholder, handler, setCustomError = null, ref = null, ...props}) => {
	const { handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors} = handler;

	console.log("FormTextField");
	console.log(field);
	console.log(handleChange);

	const {theme, styles} = useStyles();

	return (
		<TextInput style={[styles.textInput, props.inputStyle]}
			{...{placeholder}}
			keyboardType={props.type == "numeric" ? "numeric" : 'default'}
			placeholderTextColor={theme.grey7}
			onChangeText={handleChange(field)}
			onBlur={handleBlur(field)}
			onFocus={() => {setErrors({}); if(setCustomError) {setCustomError()}}}
			onSubmitEditing={() => props?.nextRef?.current?.focus() || ''}
			autoCompleteType="off"
			value={values[field]}
		/>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		textInput: {
			borderWidth: 1,
			borderColor: theme.grey5,
			width: '90%',
			color: theme.text,
			marginBottom: 20,
			backgroundColor: theme.background,
			paddingLeft:20
		}
	});

	return {theme, styles};
}
