import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppView, IconTextButton, ToggleThemeButton, Icon } from '../../components/common';
import { useTheme, WP, HP, StyledText } from '../../theme';
import { useTranslation } from 'react-i18next';


const TopSetting = ({iconName, title, onPress, ...props}) => {
	const {theme, styles} = useStyles();
	return <IconTextButton {...{iconName, title, onPress}} containerStyle={styles.topSetting} textStyle={styles.topSettingTitle}/>
}

const TopSectionSettings = () => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.topSettingsContainer}>
			<TopSetting iconName="shirt-outline" title="Deposit Funds" onPress={""} />
			<TopSetting iconName="umbrella-outline" title="Withdraw Funds" onPress={""} />
			<TopSetting iconName="ios-albums-outline" title="Deposit History" onPress={""} />
			<TopSetting iconName="ios-arrow-redo-circle-outline" title="Trade Permissions" onPress={""} />
			<TopSetting iconName="ios-boat-outline" title="Trade Reports" onPress={""} />
			<TopSetting iconName="ios-cellular-outline" title="Activity Statements" onPress={""} />
		</View>	

	)
}

const MiddleSetting = ({title, value, onPress, hasIcon = true, leftIcon, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.middleSetting}>
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				{leftIcon && <Icon iconName={leftIcon} iconSize={WP(4)} iconColor={theme.grey2}/>}
				<StyledText style={[styles.middleSettingTitle, {...leftIcon && {marginLeft: WP(2)}}]}>{title}</StyledText>
			</View>
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				{value && <StyledText style={styles.middleSettingValue}>{value}</StyledText> }
				{hasIcon && <Icon iconName="chevron-forward" iconSize={WP(4)} iconColor={theme.grey2} />}
			</View>
		</TouchableOpacity>
	)
}

const MiddleSectionSettings = () => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();
	const {t, i18n} = useTranslation();

	const currentLanguage = t('language:' + i18n.language.split("-")[0])

	return (
		<View style={styles.middleSettingsContainer}>
			<MiddleSetting title="NOTIFICATIONS" leftIcon="notifications-outline" onPress={""} />
			<MiddleSetting title="USER" leftIcon="person-outline" onPress={""} />
			<MiddleSetting title="HELP" leftIcon="help-circle-outline" onPress={""} />
			<MiddleSetting title="LANGUAGE" leftIcon="language" value={currentLanguage} onPress={() => navigation.navigate("SelectLanguage")} />
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

	return (
		<View style={styles.bottomSettingsContainer}>
			<BottomSetting title="Share the App" onPress={""} />
			<BottomSetting title="About Us" onPress={""} />
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
		<AppView title="Settings" headerRight={<ToggleThemeButton dark={theme.name == 'dark'} onToggle={onToggleTheme} />}>
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

		middleSetting: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: HP(3)
		},

		middleSettingTitle: {
			color: theme.grey2
		},

		middleSettingValue: {
			marginRight: WP(2),
			fontSize: WP(3.5),
			color: theme.grey4
		},

		bottomSettingsContainer: {
			alignItems: 'center',
			marginTop: HP(15)
		},

		bottomSetting: {
			marginBottom: HP(2)
		},

		bottomSettingTitle: {
			color: theme.grey2
		}

	});	

	return {theme, styles}
}


export default Settings;