import React, {useState} from  'react'
import {View, Image, StyleSheet} from 'react-native';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

const appIcon = require("../../assets/images/app-logo.png");
const appIconDark = require("../../assets/images/app-logo-dark.png");

export const AppIcon = ({titleBelow = '', ...props}) => {

	const {theme, styles} = useStyles();
	
	return (
		
		<View style={[styles.appLogoContainer, props.logoContainerStyle]}>
			<Image
				source={theme.name == 'light' ? appIcon : appIconDark}
				resizeMode="contain"
				style={[styles.appLogo, props.logoStyle]}
			/>
			{!!titleBelow && <StyledText style={[styles.title, props.titleStyle]}>{titleBelow}</StyledText>}
		</View>
	)
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		appLogoContainer: {
			width: WP(100),
		},
		appLogo: {
			height: 30,	
		},
		title: {

		}
	});

	return {theme, styles};
}