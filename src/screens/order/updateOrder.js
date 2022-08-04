import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import {AppView, ConfirmButton, ShowJson} from '../../components/common';
import { useUpdateOrder } from '../../helper';

//Preview should be added here
const UpdateOrder = (props) => {

	const {order, goBack} = props?.route?.params ?? {};
	
	const {navigation} = props;
	const [isError, mutate] = useUpdateOrder();

	const sendOrder = (orgOrder) => {
		console.log("Updating Order: ", orgOrder.id);
		console.log({order_id: orgOrder.id, qty: 1, type: 'limit', limit_price: orgOrder.limit_price - 1});
		mutate({order_id: orgOrder.id, qty: 1, type: 'limit', limit_price: orgOrder.limit_price - 1}, {
			onSuccess: (response, input) => navigation.navigate('OrderStatus', {goBack: goBack ? goBack() : () => navigation.navigate('StockDetail', {symbol: response.symbol}), order: response}),
			onError: (err, input) => console.log(err)
		});
	}

	return (
		<AppView title="Update Order Screen" footer={<ConfirmButton title="Confim" onClick={() => sendOrder(order)} />} >
			<ShowJson json = {order} full={false} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default UpdateOrder; 