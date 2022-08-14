import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, WP } from './index'

export const StyledText = ({children, style, ...props}) => {
	const styles = useStyles();
	
	const mergedStyle = [{}].concat(style).reduce((obj, item) => {
		return {...obj, ...item};
	});
	let fontFamily = 'JosefinSans-Regular';

	if (mergedStyle && mergedStyle?.fontWeight) {
		fontFamily = (mergedStyle?.fontWeight == '700' || mergedStyle?.fontWeight == 'bold') ? 'JosefinSans-Bold' : 'JosefinSans-Regular';
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
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		text : {
			color: theme.text,
			fontFamily: 'JosefinSans-Regular',
			// fontWeight: '400'
		},
		paddedView: {
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center'
		}
	});

	return styles;
}