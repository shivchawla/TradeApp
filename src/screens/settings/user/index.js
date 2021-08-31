import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppView, ConfirmButton } from '../../../components/common';
import { HorizontalSetting } from '../../../components/settings';

import { useTheme, WP, HP, StyledText } from '../../../theme';
import { useTranslation } from 'react-i18next';

const UserSettings = (props) => {
	const {theme, styles} = useStyles();

	return (
		<AppView title="User Settings" scroll={false}>
			
			<View style={styles.settingsContainer} >
				<HorizontalSetting title="CHANGE PASSWORD" leftIcon="lock-open-outline"  onPress={() => navigation.navigate("SelectLanguage")} />
				<HorizontalSetting title="TWO FACTOR AUTHENTICATION" leftIcon="keypad" onPress={() => navigation.navigate("SelectLanguage")} />
			</View>

			<ConfirmButton title="LOG OUT" buttonContainerStyle={styles.logoutButton} />
		</AppView>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		settingsContainer: {
			marginTop: HP(10)
		},
		logoutButton: {
			position: 'absolute',
			bottom: 20
		}
	});

	return {theme, styles};

}	

export default UserSettings;