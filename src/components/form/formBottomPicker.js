import React from 'react';
import { StyleSheet } from 'react-native';

import { BottomPicker } from '../common';
import { useTheme, WP, HP } from '../../theme';

export const FormBottomPicker = ({items, field, placeholder, ...props}) => {

	const { handleChange, values }  = props.handler;
	const value = values[field];

	return (
		<View style={styles.fieldContainer}>
			{!!value && <StyledText style={styles.labelStyle}>{placeholder}</StyledText>}
			<BottomPicker {...{items}}
				selectedValue={items.find(it => it.key == value) || {title: placeholder}} 
				onSelect={(item) => handleChange(field)(item.key)} 
				pickerContainerStyle={styles.pickerView} 
				valueStyle={[styles.pickerViewValue, {...!value && {color: theme.grey7}}]} 
			/>
		</View>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		fieldContainer: {
			width: '90%', 
			borderWidth:1, 
			borderColor: theme.grey5, 
		},
		pickerView: {
			alignItems: 'center', 
			height:50,
			paddingLeft: WP(4),
			paddingRight: WP(4), 
			justifyContent:'space-between', 
			marginBottom: HP(3)
		},

		pickerViewValue: {
			fontSize: WP(4.5)
		},

		labelStyle: {
			position: 'absolute',
			marginTop: -24, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			backgroundColor: theme.background,
		}
	});

	return {theme, styles};
}

