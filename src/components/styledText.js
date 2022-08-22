import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './index'

export const StyledText = ({children, style, isNumber = false, ...props}) => {
	const styles = useStyles();
	
	let mergedStyle = [{}].concat(style).reduce((obj, item) => {
		return {...obj, ...item};
	});

	let fontFamilyRegular = 'JosefinSans-Regular';
	let fontFamilyBold = 'JosefinSans-Bold';
	// mergedStyle = {...mergedStyle, borderColor: 'white', borderWidth: 1}

	if(isNumber) {
		fontFamilyRegular = 'Rubik-Regular';
		fontFamilyBold = 'Rubik-Regular';
	}

	let fontFamily = fontFamilyRegular;

	if (mergedStyle && mergedStyle?.fontWeight) {
		fontFamily = ['700', 'bold'].includes(mergedStyle?.fontWeight) ? fontFamilyBold : fontFamilyRegular; 
		delete mergedStyle['fontWeight'];
	}

	return (
		<Text {...props} style={[styles.text, mergedStyle, {fontFamily}]}>{children}</Text>
	)
}

export const PaddedView = ({children, style}) => {
	const styles = useStyles();
	return <View style={[styles.paddedView, style]}>{children}</View>;
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();
	

	const styles = StyleSheet.create({
		text : {
			color: theme.text,
		},
		paddedView: {
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center'
		}
	});

	return styles;
}