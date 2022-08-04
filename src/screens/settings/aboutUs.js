import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppView, AppIcon, SocialIcon, TinyTextButton } from '../../components/common';
import { HorizontalSetting } from '../../components/settings';

import { useTheme, WP, HP, StyledText } from '../../theme';

const AboutUs = (props) => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();

	return (
		<AppView title="ABOUT US" scroll={false} staticViewStyle={{alignItems: 'center', justifyContent: 'center'}}>
			<View style={styles.top}>
				<AppIcon logoContainerStyle={styles.logoContainer} logoStyle={{height: 70}} titleStyle={styles.title}/>
				<StyledText style={styles.screenTitle}>FINCRIPT</StyledText>
			</View>

			<View style={styles.followUsContainer} >
				<StyledText style={styles.followUsTitle}>You can follow us on</StyledText>
				<View style={styles.socialIcons}>
					<SocialIcon social="whatsapp" iconColor={theme.whatsapp}/>
					<SocialIcon social="instagram" iconColor={theme.instagram}/>
					<SocialIcon social="facebook" iconColor={theme.facebook}/>
					<SocialIcon social="twitter" iconColor={theme.twitter}/>
				</View>	
			</View>

			<View style={styles.bottom}>
				<StyledText style={styles.bottomText}>Version: v1.1</StyledText>
				<StyledText style={styles.bottomText}>Fincript S.A.</StyledText>
				<TinyTextButton title="www.fincript.com" onPress={() => Linking.openURL("https://www.fincript.com")} buttonTextStyle={styles.link}/>
				<TinyTextButton title="contacto@fincript.com" onPress={() => Linking.openURL('mailto:contacto@fincript.com')} buttonTextStyle={styles.link}/> 
			</View>

		</AppView>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		screenTitle: {
			color: theme.icon,
			fontSize: WP(7),
			fontWeight: 'bold',
			marginTop: HP(2)
		},
		followUsContainer: {
			alignItems: 'center',
			// marginTop: HP(10),
			width : '100%'
		},
		followUsTitle: {
			fontSize: WP(5)
		},
		socialIcons: {
			flexDirection: 'row',
			width: '70%',
			justifyContent: 'space-between',
			marginTop: HP(5),
			alignItems: 'center',
		}, 
		contactUs: {
			marginTop: HP(15),
		}, 
		bottom: {
			alignItems: 'center',
			position: 'absolute',
			bottom: 10,
			textAlign: 'center'
		},
		top: {
			alignItems: 'center',
			position: 'absolute',
			top: 50,
			textAlign: 'center'	
		},
		link:{ 
			color: theme.grey3,
			fontSize: WP(5),
		},
		bottomText: {
			color: theme.grey2,
			fontSize: WP(4.5),
			marginBottom: HP(1)
		}

	});

	return {theme, styles};

}	

export default AboutUs;
