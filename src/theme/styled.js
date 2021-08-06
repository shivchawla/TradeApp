import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from './index'

export const StyledText = ({children, style, ...props}) => {
	const styles = useStyles();
	return (
		<Text {...props} style={[styles.text, style]}>{children}</Text>
	)
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		text : {
			color: theme.text,
			fontFamily: 'Roboto'
		}
	});

	return styles;
}