import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';

export const SimpleButton = ({title, onClick, disabled = false,  ...props}) => {
	const {theme, styles} = useStyles();

	const ClickableComponent = disabled ? View : TouchableOpacity;

	return (
		<ClickableComponent style={[styles.button, props.buttonStyle, {...disabled && {backgroundColor: theme.grey9}}]} onPress={disabled ? null : onClick}>
			<StyledText style={[styles.buttonText, props.buttonTextStyle]}>{title}</StyledText>
		</ClickableComponent>
	);
}
	
const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		button: {
		    backgroundColor:'#FE9901',
		    height: 35,
		    justifyContent:'center',
		    alignItems:'center',
		    width: '100%'
		  },
		buttonText: {
		    fontFamily: "roboto-700",
		    color: 'white',
		    fontSize: 16,
		    fontWeight:"700"
		},
	});

	return {theme, styles};
}
