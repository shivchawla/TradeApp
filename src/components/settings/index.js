import React from 'react';
import { TouchableOpacity, View, StyleSheet, Switch } from 'react-native';

import { CustomIcon, InfoText } from '../common';

import {useTheme, WP, HP, StyledText} from '../../theme';

export const HorizontalSetting = ({title, value, onPress, hasIcon = true, leftIcon, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.horizontalSettingContainer}>
			<View style={styles.flexContainer}>
				{leftIcon && <CustomIcon iconName={leftIcon} iconSize={WP(4)} iconColor={theme.grey2}/>}
				<StyledText style={[styles.horizontalSettingTitle, {...leftIcon && {marginLeft: WP(2)}}]}>{title}</StyledText>
			</View>
			<View style={styles.flexContainer}>
				{value && <StyledText style={styles.horizontalSettingValue}>{value}</StyledText> }
				{hasIcon && <CustomIcon iconName="chevron-forward" iconSize={WP(4)} iconColor={theme.grey2} />}
			</View>
		</TouchableOpacity>
	)
}

export const SwitchSetting = ({title, description, value, onSwitch, showAlert = false}) => {
	const {theme, styles} = useStyles();

	return ( 
		<View style={styles.switchSettingContainer}>
			<View>
				{showAlert ?
					<InfoText text={title} info={description} textStyle={styles.switchTitle}/>
					: 
					<StyledText style={styles.switchTitle}>{title}</StyledText>
				}
				{description && <StyledText style={styles.switchDescription}>{description}</StyledText>}
			</View>
			<Switch {...{value}} onValueChange={onSwitch} />
		</View>
	)
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		horizontalSettingContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: HP(4)
		},

		horizontalSettingTitle: {
			color: theme.grey2,
			fontSize: WP(4),
		},

		horizontalSettingValue: {
			marginRight: WP(2),
			fontSize: WP(3.5),
			color: theme.grey4
		},

		flexContainer: {
			flexDirection: 'row', 
			alignItems: 'center'
		},

		switchSettingContainer: {
			flexDirection: 'row', 
			alignItems: 'center',
			justifyContent: 'space-between',
			marginBottom: HP(4)
		},

		switchTitle: {
			color: theme.grey2,
			fontSize: WP(4.2),
		},

		switchDescription: {
			color: theme.grey4,
			fontSize: WP(3.8),
		}

	});

	return {theme, styles};
}
