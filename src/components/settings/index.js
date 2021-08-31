import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import {Icon} from '../common';

import {useTheme, WP, HP, StyledText} from '../../theme';

export const HorizontalSetting = ({title, value, onPress, hasIcon = true, leftIcon, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.settingContainer}>
			<View style={styles.flexContainer}>
				{leftIcon && <Icon iconName={leftIcon} iconSize={WP(4)} iconColor={theme.grey2}/>}
				<StyledText style={[styles.settingTitle, {...leftIcon && {marginLeft: WP(2)}}]}>{title}</StyledText>
			</View>
			<View style={styles.flexContainer}>
				{value && <StyledText style={styles.settingValue}>{value}</StyledText> }
				{hasIcon && <Icon iconName="chevron-forward" iconSize={WP(4)} iconColor={theme.grey2} />}
			</View>
		</TouchableOpacity>
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		settingContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: HP(4)
		},

		settingTitle: {
			color: theme.grey2,
			fontSize: WP(4),
		},

		settingValue: {
			marginRight: WP(2),
			fontSize: WP(3.5),
			color: theme.grey4
		},

		flexContainer: {
			flexDirection: 'row', 
			alignItems: 'center'
		}

	});

	return {theme, styles};
}
