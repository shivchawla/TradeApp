import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation } from '@react-navigation/native'

import { AppView, TinyTextButton, AppIcon } from '../../components/common';
import { useTheme, StyledText }  from '../../theme';

const AuthLogo = () => {

    const {styles} = useStyles();

    return (
        <AppIcon 
            logoContainerStyle={styles.logoContainer} 
            logoStyle={styles.logoStyle} 
		/>
    )
}

const AuthTitle = ({header, ...props}) => {

    const {styles} = useStyles();

    return (
        <View style={styles.leftContainer}>
            <StyledText style={styles.screenTitle}>{header.title}</StyledText>
            <StyledText style={styles.screenDesc}>{header.description}</StyledText>
        </View>
    )
}

export const AuthFooterDefault = ({footerText, buttonTitle, onPress, ...props}) => {

	const {styles} = useStyles();

	return (
		<View style={[styles.footerContainer, props.footerStyle]}>
			<StyledText style={styles.footerText}>{footerText}</StyledText>
			<TinyTextButton title={buttonTitle} {...{onPress}} />
		</View>
	)
}

export const AuthLayout = ({children, isLoading, ...props}) => {
	const {styles} = useStyles();
	
    return ( 
        <AppView isLoading={isLoading} goBack={false} scroll={false} scrollViewStyle={styles.screenContentStyle} keyboardMode="overlap">
            <AuthLogo></AuthLogo>
            <AuthTitle {...props}></AuthTitle>
            {children}
        </AppView>
    )	
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		screenContentStyle: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		leftContainer:{
			marginTop: HP(3),
			marginBottom: HP(3),
			alignItems: 'flex-start',
			width: '100%',
			paddingLeft: WP(5)
		},
		formContainer: {
			flex:0, 
		},
		submitButtonContainer:{
			position: 'relative', 
			marginBottom: HP(5)
		},
		submitButton: {
			width: '70%', 
			marginTop: WP(0),
		},
		footerContainer: {
			alignItems: 'center',
			marginTop: HP(5)
		},
		logoContainer: {
			paddingLeft: WP(5),
			width: '100%',
			alignItems: 'flex-start',
			marginTop: HP(4),
			marginBottom: HP(4),
		},
		logoStyle: {
			width: WP(50), 
			marginBottom: HP(1)
		},
		screenTitle: {
			fontWeight: 'bold',
			fontSize: WP(6),
			color: theme.icon
		},
		stepTextContainer: {
			marginBottom: HP(5),
		},
		currentStepText: {
			color: theme. grey5,
			fontSize: WP(4),
			marginTop: HP(1)
		},
		footerText: {
			color: theme.grey2,
		},
		error: {
			color: theme.error,
			marginBottom: HP(5),
			textAlign: 'center'
		},
		circle: {
			height: HP(1),
			width: HP(1),
			borderRadius: HP(0.5),
			backgroundColor: theme.green,
			marginLeft: WP(2),
			justifyContent: 'center',
			alignItems: 'center'
		}
	})

	return {theme, styles};
}
