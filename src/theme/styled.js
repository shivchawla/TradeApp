import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, WP } from './index'

export const StyledText = ({children, style, ...props}) => {
	const styles = useStyles();
	return (
		<Text {...props} style={[styles.text, style]}>{children}</Text>
	)
}

export const PaddedView = ({children, style}) => {
	const styles = useStyles();
	return <View style={[styles.paddedView, style]}>{children}</View>;
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		text : {
			color: theme.text,
			fontFamily: 'Roboto'
		},
		paddedView: {
			paddingLeft: WP(3),
			paddingRight: WP(3),
			width: '100%'
		}
	});

	return styles;
}