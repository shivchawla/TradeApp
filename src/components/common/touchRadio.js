import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { StyledText, useTheme, WP } from '../../theme';


export const TouchRadio = ({selected, onToggle}) => {
	const theme = useTheme();
	return (
		<TouchableOpacity onPress={onToggle} >
			{selected ?
				<Ionicons name="radio-button-on" color={theme.backArrow } size={WP(5)} />
				:
				<Ionicons name="radio-button-off" color={theme.backArrow } size={WP(5)} />
			}
			</TouchableOpacity>
	)
} 

