import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const PlaceOrder = (props) => {

	return (
		<AppView>
			<ScreenName name="Place Order Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PlaceOrder;