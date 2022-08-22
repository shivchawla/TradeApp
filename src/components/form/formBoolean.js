import React from 'react';
import { View, StyleSheet } from 'react-native';
import get from 'lodash/get';

import { TouchRadioGroup } from '../common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'; 

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

	const {theme, styles} = useStyles();
	const { HP, WP } = useDimensions();

	return (
		<View style={[{width: '100%'}, props.style, {...props.horizontal && {flexDirection: 'row', justifyContent: 'space-between'}}]}>
			<StyledText style={styles.text}>{title}</StyledText>
			<TouchRadioGroup 
				items={items} 
				selectedIndex={value == "YES" ? 1 : 0} 
				onSelect={onSelect}
				style={[{marginTop: HP(1)}, {...props.horizontal && {marginLeft: WP(5)}}]} 
			/>
		</View>
	)
}


const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = StyleSheet.create({
		text: {
			fontSize: WP(5),
		}
	});

	return {theme, styles};

}