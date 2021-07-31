import React from 'react';
import { useTheme } from '@react-navigation/native';
import {Text} from 'react-native';

export const StyledText = ({children, style, ...props}) => {
	const { colors } = useTheme();
	return (
		<Text {...props} style={[style, {color: colors.text}]}>{children}</Text>
	)
}