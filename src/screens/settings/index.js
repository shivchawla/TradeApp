import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Share, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppView, IconTextButton, ToggleThemeButton, Icon } from '../../components/common';
import { HorizontalSetting } from '../../components/settings';

import { useTheme, WP, HP, StyledText } from '../../theme';
import { useTranslation } from 'react-i18next';

const TopSetting = ({iconName, title, onPress, ...props}) => {
	const {theme, styles} = useStyles();
	return <IconTextButton {...{iconName, title, onPress}} containerStyle={styles.topSetting} textStyle={styles.topSettingTitle}/>
}

const TopSectionSettings = () => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();

	return (
		<View style={styles.topSettingsContainer}>
			<TopSetting iconName="shirt-outline" title="Deposit Funds" onPress={() => navigation.navigate('CreateDeposit')} />
			<TopSetting iconName="umbrella-outline" title="Withdraw Funds" onPress={() => navigation.navigate('CreateWithdraw')} />
			<TopSetting iconName="ios-albums-outline" title="Deposit History" onPress={() => navigation.navigate("FundHistory")} />
			<TopSetting iconName="ios-arrow-redo-circle-outline" title="Trade Settings" onPress={() => navigation.navigate('TradeSettings')} />
			<TopSetting iconName="ios-boat-outline" title="Trade Reports" onPress={() => navigation.navigate('DownloadDocument', {type: 'trade_confirmation'})} />
			<TopSetting iconName="ios-cellular-outline" title="Account Statement" onPress={() => navigation.navigate('DownloadDocument', {type: 'account_statement'})} />
		</View>	
	)
}

const MiddleSectionSettings = () => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();
	const {t, i18n} = useTranslation();

	const currentLanguage = t('language:' + i18n.language.split("-")[0])

	return (
		<View style={styles.middleSettingsContainer}>
			<HorizontalSetting title="NOTIFICATIONS" leftIcon="notifications-outline" onPress={() => navigation.navigate("Notifications")} />
			<HorizontalSetting title="USER" leftIcon="person-outline" onPress={() => navigation.navigate("UserSettings")} />
			<HorizontalSetting title="HELP" leftIcon="help-circle-outline" onPress={() => navigation.navigate("FAQ")} />
			<HorizontalSetting title="LANGUAGE" leftIcon="language" value={currentLanguage} onPress={() => navigation.navigate("SelectLanguage")} />
		</View>
	)
}


const BottomSetting = ({title, onPress, ...props}) => {
	const {theme, styles} = useStyles();

	return  (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.bottomSetting}>
			<StyledText style={styles.bottomSettingTitle}>{title}</StyledText>
		</TouchableOpacity>
	)
}

const BottomSectionSettings = () => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();

	const shareApp = async() => {

		const shareObj = {
	        message: 'Fincript | Start Investing',
	        ...Platform.OS === 'ios' &&  {url:'https://play.google.com/store/apps/details?id=com.mejspc.app'},
	        ...Platform.OS === 'android' &&  {title:'https://play.google.com/store/apps/details?id=com.mejspc.app'},

	      };

	      console.log(shareObj);
		try {
	      const result = await Share.share(shareObj);
	    } catch (error) {
	      console.log("Error while shring app: ", error);
	    }
	}

	return (
		<View style={styles.bottomSettingsContainer}>
			<BottomSetting title="Share the App" onPress={shareApp} />
			<BottomSetting title="About Us" onPress={() => navigation.navigate('AboutUs')} />
		</View>
	)
}

const Settings = (props) => {
	
	const {updateTheme} = useTheme();
	const {theme, styles} = useStyles();

	const onToggleTheme = () => {
		console.log("Toggling Theme");
		console.log("Current Theme: ", theme.name);

		updateTheme(theme.name == 'dark' ? 'light' : 'dark');
	}
	
	return (
		<AppView scroll={false} title="Settings">
			<TopSectionSettings />
			<MiddleSectionSettings />
			<BottomSectionSettings />
		</AppView>
	);
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		topSettingsContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			marginTop: HP(5),
			paddingTop: HP(5),
			backgroundColor:theme.grey9
		},

		topSetting: {
			width: '30%',
			marginBottom: HP(4),
			alignItems: 'center',
			paddingRight: WP(10),
			paddingLeft: WP(10),
			// borderColor: 'white',
			// borderWidth: 1
		},

		topSettingTitle: {
			width: WP(20), 
			textAlign: 'center',
			fontSize: WP(3.5),
			color: theme.grey2,
			marginTop: WP(2)
		},

		middleSettingsContainer: {
			marginTop: HP(5)
		},

		bottomSettingsContainer: {
			alignSelf: 'center',
			position: 'absolute',
			bottom: 10
		},

		bottomSetting: {
			marginBottom: HP(2),
			alignItems: 'center',
		},

		bottomSettingTitle: {
			color: theme.grey2,
			fontSize: WP(4.5)
		}

	});	

	return {theme, styles}
}


export default Settings;