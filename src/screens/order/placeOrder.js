import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ConfirmButton from '../../components/confirmButton';
import ShowJson from '../../components/showJson';
import { usePlaceOrder } from '../../helper';

const PlaceOrder = (props) => {

	const {symbol, action} = props.route.params;
	
	const {navigation} = props;
	const [isError, mutate] = usePlaceOrder();

	const sendOrder = ({symbol, action}) => {
		console.log(symbol);
		console.log(action);
		mutate({symbol, side: action.toLowerCase(), qty: 1}, {
			onSuccess: (response, input) => navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('StockDetail', {symbol}), response}),
			onError: (err, input) => console.log(err)
		});
	}

	return (
		<AppView title="Place Order Screen" footer={<ConfirmButton title="Confim" onClick={() => sendOrder({symbol, action})} />} >
			<ShowJson json = {{symbol, action}} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PlaceOrder; 