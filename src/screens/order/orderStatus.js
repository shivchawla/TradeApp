import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ShowJson from '../../components/showJson'

const OrderStatus = (props) => {

	const {response, goBack} = props.route.params;

	return (
		<AppView title="Order Status Screen" goBack={goBack || true}>
			{response && <ShowJson json={response} />}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default OrderStatus;