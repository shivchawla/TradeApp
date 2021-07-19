import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const ChooseStock = (props) => {

	return (
		<AppView>
			<ScreenName name="Choose Stock Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default ChooseStock;