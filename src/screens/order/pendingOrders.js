import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import get from 'lodash/get';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import PendingOrderList from '../../components/pendingOrderList';

const PendingOrders = (props) => {

	const {symbol, status, goBack} = get(props, 'route.params', {});

	return (
		<AppView title="Pending Orders Screen" goBack={goBack || true}>
			<PendingOrderList {...{symbol, status}}}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrders;