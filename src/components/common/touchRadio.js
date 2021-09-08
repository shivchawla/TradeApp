import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { StyledText, useTheme, WP } from '../../theme';

export const TouchRadio = ({selected, title='', onToggle}) => {
	const {theme} = useTheme();
	return (
		<TouchableOpacity onPress={onToggle} >
			{selected ?
				<View style={{flexDirection: 'row'}}>
					{title && <StyledText style={{marginRight: WP(1)}}>{title}</StyledText>}
					<Ionicons name="radio-button-on" color={theme.backArrow } size={WP(5)} />
				</View>
				:
				<View style={{flexDirection: 'row'}}>
					{title && <StyledText style={{marginRight: WP(1)}}>{title}</StyledText>}
					<Ionicons name="radio-button-off" color={theme.backArrow } size={WP(5)} />
				</View>
			}
			</TouchableOpacity>
	)
}



export const TouchRadioGroup = ({items, selectedIndex = 0, onSelect, ...props}) => {
	const {theme} = useTheme();

	const onClick = (index) => {
		// console.log("onClick: ", index);
		if (index == selectedIndex) {
			return;
		} else {
			onSelect(index);
		}
	}

	return (
		<View style={[{flexDirection: 'row'}, props.containerStyle]}>
			{items.map((item, index) => {
				return <TouchRadio key={index} title={items[index]} selected={index == selectedIndex} onToggle={() => onClick(index)}/>	
			})}
		</View>
	)
}  

