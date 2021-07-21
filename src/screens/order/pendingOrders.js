import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import PendingOrderList from '../../components/pendingOrderList';

const PendingOrders = (props) => {

	const {symbol, status, goBack} = props.route.params;
	const [isError, pendingOrders] = useOrders({symbol});

	return (
		<AppView title="Pending Orders Screen" goBack={goBack || true}>
			<PendingOrderList {...{symbol, status}} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrders;