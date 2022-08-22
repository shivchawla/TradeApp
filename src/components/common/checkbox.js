import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const Ionicons  = Icon;

import { StyledText, useTheme, WP } from '../../theme';

export const Checkbox = ({value, title='', onToggle, disabled = false, ...props}) => {
	const {theme, HP, WP, Typography} = useTheme();


	const Component = disabled ? View : TouchableOpacity;
	
	return (
		<Component onPress={onToggle} >
			{value ?
				<View style={{flexDirection: 'row'}}>
					{!!title && <StyledText style={{marginRight: WP(1)}}>{title}</StyledText>}
					<Ionicons name="checkbox-outline" color={theme.backArrow } size={WP(5)} />
				</View>
				:
				<View style={{flexDirection: 'row'}}>
					{!!title && <StyledText style={{marginRight: WP(1)}}>{title}</StyledText>}
					<Ionicons name="square-outline" color={theme.backArrow } size={WP(5)} />
				</View>
			}
		</Component>
	)
}

