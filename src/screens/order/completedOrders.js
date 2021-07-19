import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const CompletedOrders = (props) => {

	return (
		<AppView>
			<ScreenName name="Completed Orders Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default CompletedOrders;