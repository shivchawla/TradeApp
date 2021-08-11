import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView, ScreenName} from '../../components/common';

const Settings = (props) => {
	const {stocks} = props;

	return (
		<AppView>
			<ScreenName name="Settings Main Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Settings;