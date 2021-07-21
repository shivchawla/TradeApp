import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import ShowJson from './showJson';

import { useOrders } from '../helper';

const PendingOrdersList = ({symbol, status}) => {

	const [isError, pendingOrders] = useOrders({symbol, status});

	return (
		<>
		{pendingOrders && pendingOrders.map((order, index) => {
			return <ShowJson key={index} json={order} />
			})
		}
		</>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrdersList;