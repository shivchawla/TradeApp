import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const OrderPreview = (props) => {

	return (
		<AppView>
			<ScreenName name="Order Status Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default OrderPreview;