import React, {useState} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppView, AppIcon } from '../../components/common';
import { useTheme, HP, WP, StyledText} from '../../theme';

const Splash = () => {

	const {theme, styles} = useStyles();	
	const {t} = useTranslation();
	
	return (
		<AppView goBack={false} scroll={false} appContainerStyle={styles.containerStyle} staticViewStyle={styles.staticView}>
			<AppIcon 
            	logoContainerStyle={styles.logoContainer} 
            	logoStyle={styles.logoStyle} 
			/>
			<StyledText style={styles.tagline}>{t('company:tagline')}</StyledText>  
		</AppView> 
	);
	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		containerStyle: {
			alignItems: 'center', 
		},
		staticView: {
			justifyContent: 'center',
			alignItems: 'center', 
		},
		bold: {
			color: "#fff",
			fontSize: WP(9),
			fontWeight:'bold',
		},
		tagline :{
			color: "#fff",
			fontSize: WP(5),
			marginTop: HP(2)
		},
		logoContainer: {
			width: '100%',
		},
		logoStyle: {
			width: WP(50),
			height:30
		},
	});	

	return {theme, styles}
}


export default Splash;
