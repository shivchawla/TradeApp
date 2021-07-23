import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import get from 'lodash/get';

import AppView from '../../components/appView';
import PendingOrderList from '../../components/pendingOrderList';

//Now this scrren is not updated on routing back - how to update screen
const PendingOrders = (props) => {

	const {symbol, status, goBack} = get(props, 'route.params', {});

	return (
		<AppView title="Pending Orders Screen" goBack={goBack || true}>
			<PendingOrderList {...{symbol, status}}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrders;