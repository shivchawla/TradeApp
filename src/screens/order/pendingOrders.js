import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const PendingOrders = (props) => {

	return (
		<AppView>
			<ScreenName name="Pending Orders Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrders;