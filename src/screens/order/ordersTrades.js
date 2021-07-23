import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import get from 'lodash/get';

import AppView from '../../components/appView';
import OrderList from '../../components/orderList';

//Now this scrren is not updated on routing back - how to update screen
const OrdersTrades = (props) => {

	const {symbol, status, goBack} = get(props, 'route.params', {});

	return (
		<AppView title="Pending Orders Screen" goBack={goBack || true}>
			<OrderList {...{symbol, status: "open"}}/>
			<OrderList {...{symbol, status: "closed"}}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default OrdersTrades;