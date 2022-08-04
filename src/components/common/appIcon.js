import React, {useState} from  'react'
import {View, Image, StyleSheet} from 'react-native';

import {useTheme, HP, WP, StyledText} from '../../theme';

const appIcon = require("../../assets/images/app-logo.png");

export const AppIcon = ({titleBelow = '', ...props}) => {

	const {theme, styles} = useStyles();
	
	return (
		<View style={[styles.appLogoContainer, props.logoContainerStyle]}>
			<Image
				source={appIcon}
				resizeMode="contain"
				style={[styles.appLogo, props.logoStyle]}
			/>
			{!!titleBelow && <StyledText style={[styles.title, props.titleStyle]}>{titleBelow}</StyledText>}
		</View>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		appLogoContainer: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		appLogo: {
			height: 100,	
			justifyContent: 'center',
			alignItems: 'center'
		},
		title: {

		}
	});

	return {theme, styles};
}