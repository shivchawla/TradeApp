import React from 'react';
import { View, StyleSheet } from 'react-native';
import get from 'lodash/get';

import { TouchRadioGroup } from '../common';
import { useTheme, WP, HP, StyledText } from '../../theme'; 

export const FormBooleanField = ({items = ['NO', 'YES'], title, field, ...props}) => {

	const { handleChange, values} = props.handler;
	const value = get(values, field);

	const onSelect = (index) => {
		// console.log("On Select: ", index);
		// console.log("Field:", field);
		// console.log(handleChange(field));
		// console.log(index == 1);
		handleChange(field)(items[index]);
	}

	// console.log("Value: ", value);
	// console.log("Passed Index:", value ? 1 : 0);
	// console.log("Passed Index:", value ? "YES" : "NO");

	return (
		<View>
			<StyledText>{title}</StyledText>
			<TouchRadioGroup items={items} selectedIndex={value == "YES" ? 1 : 0} onSelect={onSelect} />
		</View>
	)
}


const useStyles = () => {

	const {theme} = useTheme();

	const styles = StyleSheet.create({

	});

	return {theme, styles};

}