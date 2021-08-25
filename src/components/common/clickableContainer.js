import React from 'react';
import { TouchableOpacity } from 'react-native'

export const ClickableView = ({children, onPress, opacity = 1.0, ...props}) => {
	return (
		<TouchableOpacity activeOpacity={opacity} onPress={onPress} style={props.style}>
			{children}
		</TouchableOpacity>
	)
}

export const Clickable = ({children, onPress, opacity = 0.5, ...props}) => {
	return (
		<TouchableOpacity activeOpacity={opacity} onPress={onPress} style={props.style}>
			{children}
		</TouchableOpacity>
	)
}