import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import get from 'lodash/get';

import { useTheme, StyledText, WP, HP } from '../../theme';

export const FormTextField = ({field, placeholder, handler, setCustomError = null, ref = null, ...props}) => {
	const { handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors} = handler;

	// console.log("FormTextField");
	// console.log(field);
	// console.log(handleChange);

	const {theme, styles} = useStyles();
	const value = get(values, field);
	const error = get(errors, field);

	return (
		<View style={[styles.fieldContainer, props.containerStyle]}>
			<View style={styles.inputContainer}>
				{!!value && <StyledText style={styles.labelStyle}>{placeholder}</StyledText>}
				<TextInput style={[styles.textinput, props.inputStyle]}
					{...{placeholder}}
					keyboardType={props.type == "numeric" ? "numeric" : 'default'}
					placeholderTextColor={theme.grey7}
					onChangeText={handleChange(field)}
					onBlur={handleBlur(field)}
					onFocus={() => {setErrors({}); if(setCustomError) {setCustomError()}}}
					onSubmitEditing={() => props?.nextRef?.current?.focus() || ''}
					autoCompleteType="off"
					value={value}
				/>
			</View>
			{error && <StyledText style={styles.errorText}>{error}</StyledText>}

		</View>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		fieldContainer: {
			marginBottom: HP(3),
			width: '90%',
		},
		inputContainer: {
			borderWidth: 1,
			borderColor: theme.grey5,
			paddingLeft: WP(3)
		},
		textInput: {
			color: theme.text,
			backgroundColor: theme.background,
		},
		labelStyle: {
			position: 'absolute',
			marginTop: -11, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			left: WP(3),
			backgroundColor: theme.background
		},
		errorText: {
			textAlign:'left',
			color: theme.error,
			marginTop: HP(0.2)
		},
	});

	return {theme, styles};
}
