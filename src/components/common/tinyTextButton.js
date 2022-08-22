import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

export const TinyTextButton = ({title, onPress, ...props}) => {
	const {theme, styles} = useStyles();
	return (
		<TouchableOpacity style={[styles.tinyButton, props.buttonStyle]} onPress={onPress}>
			<StyledText style={[styles.tinyButtonText, props.buttonTextStyle]}>{title}</StyledText>
		</TouchableOpacity>
	)
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	
	const styles = StyleSheet.create({
		tinyButton: {
			padding: WP(0.5),
			paddingLeft: WP(2.5),
			paddingRight: WP(2.5),
		},
		tinyButtonText: {
			color: theme.backArrow,
			fontWeight: '700'
		}
	})

	return {theme, styles};
}