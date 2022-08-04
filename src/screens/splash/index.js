import React, {useState} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { AppView } from '../../components/common';
import { useTheme, HP, WP, StyledText} from '../../theme';

const appIcon = require("../../assets/images/app-logo.png");

const Splash = () => {

	const {theme, styles} = useStyles();	
	
	return (
		<AppView goBack={false} scroll={false} appContainerStyle={styles.containerStyle} staticViewStyle={styles.staticView}>
			<Image
				source={appIcon}
				resizeMode="contain"
				style={styles.image}
			/>
			<StyledText style={styles.bold}>FINCRIPT</StyledText>  
			<StyledText style={styles.tagline}>Invest with us</StyledText>  
		</AppView> 
	);
	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		containerStyle: {
			// alignItems: 'center', 
		},
		staticView: {
			justifyContent: 'center',
			alignItems: 'center', 
		},
		bold: {
			// fontFamily: "roboto-regular",
			color: "#fff",
			fontSize: WP(9),
			fontWeight:'bold',
			marginTop: HP(2)
		},
		tagline :{
			// fontFamily: "roboto-regular",
			color: "#fff",
			fontSize: WP(5),
			marginTop: HP(0)
		},

		image: {
			// marginTop: 50,
			height: 100
		}
	});	

	return {theme, styles}
}


export default Splash;
