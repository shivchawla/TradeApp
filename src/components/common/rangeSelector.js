import React, {use} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';

export const RangeSelector = ({items, onSelect, selectedIndex}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.rangeSelector}>
			{items.map((item, index) => {
				return (
					<TouchableOpacity key={item} style={{...index==selectedIndex && styles.selectedRange}} activeOpacity={1.0} onPress={() => onSelect(index)}>
						<StyledText style={[styles.rangeText, {...index==selectedIndex && styles.selectedRangeText}]}>{item}</StyledText>
					</TouchableOpacity>
				)
			})}
		</View>

	) 
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

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
			borderColor: theme.icon,
			paddingLeft: WP(2),
			paddingRight: WP(2)
		},
		selectedRangeText: {
			color: theme.icon
		},
		rangeText: {
			color: theme.grey2
		}
	});

	return {theme, styles};

}
