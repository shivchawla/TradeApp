import React from 'react';
import {Text} from 'react-native';
import { useTheme } from './index'

export const StyledText = ({children, style, ...props}) => {
	const theme = useTheme();

	return (
		<Text {...props} style={[{color: theme.text}, style]}>{children}</Text>
	)
}