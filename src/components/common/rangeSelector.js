import React, {use} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import * as Theme  from '../../theme';
const { useTheme, StyledText, WP, HP} = Theme;

export const RangeSelector = ({items, onSelect, selectedIndex}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.rangeSelector}>
			{items.map((item, index) => {
				return (
					<TouchableOpacity key={item} style={{...index==selectedIndex && styles.selectedRange}} activeOpacity={1.0} onPress={() => onSelect(index)}>
						<StyledText style={styles.rangeText}>{item}</StyledText>
					</TouchableOpacity>
				)
			})}
		</View>

	) 
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		rangeSelector: {
			flexDirection: 'row',
			width: '100%',
			justifyContent: 'space-between',
			paddingLeft: WP(5),
			paddingRight: WP(5),
			marginTop: HP(4)
		},
		selectedRange: {
			borderWidth:1,
			borderColor: theme.green,
			paddingLeft: WP(2),
			paddingRight: WP(2)
		},
		rangeText: {
			color: theme.green
		}
	});

	return {theme, styles};

}
