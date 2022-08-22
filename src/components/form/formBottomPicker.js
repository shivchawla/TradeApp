import React from 'react';
import { View, StyleSheet } from 'react-native';
import get from 'lodash/get';

import { BottomPicker } from '../common';
import { useTheme, StyledText } from '../../theme';

export const FormBottomPicker = ({items, field, placeholder, ...props}) => {

	const { handleChange, values, errors }  = props.handler;
	const value = get(values, field);
	const error = get(errors, field);

	const {theme, styles} = useStyles();

	return (
		<View style={styles.fieldContainer}>
			<View>
				{!!value && <StyledText style={styles.labelStyle}>{placeholder}</StyledText>}
			</View>
			
			<BottomPicker {...{items}}
				placeholder
				selectedValue={items.find(it => it.key == value) || {title: placeholder}} 
				onSelect={(item) => handleChange(field)(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={[styles.pickerViewValue, {...!value && {color: theme.grey7}}]} 
			/>
			{error && <StyledText style={styles.errorText}>{error}</StyledText>}

		</View>
	)
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		fieldContainer: {
			width: '90%', 
			borderWidth:1, 
			borderColor: theme.grey5,
			height:50,
			marginBottom: HP(3),
			justifyContent: 'center'
		},
		pickerView: {
			alignItems: 'center', 
			paddingLeft: WP(4),
			paddingRight: WP(4), 
			justifyContent:'space-between', 
		},

		pickerViewValue: {
			fontSize: WP(4.5)
		},

		labelStyle: {
			position:'absolute',
			marginTop: -24, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			left:10,
			backgroundColor: theme.background,
		},
		errorText: {
			textAlign:'left',
			color: theme.error,
			marginTop: HP(0.2)
		},
	});

	return {theme, styles};
}

