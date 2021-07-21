import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName';
import SingleStock from '../../components/singleStock';
import TradeButtons from '../../components/tradeButtons';
import StockPosition from '../../components/stockPosition';
import PendingOrderList from '../../components/pendingOrderList';

const StockDetail = (props) => {
	console.log("Stock Detail");
	console.log(props);
	const {symbol} = props.route.params;
	const {navigation} = props;
	const onBuy = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "BUY"});
	}

	const onSell = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "SELL"});		
	}

	return (
		<AppView footer={<TradeButtons {...{onBuy, onSell}}/>} title="Stock Detail Screen">
			<PendingOrderList {...{symbol}} />
			<SingleStock {...{symbol}} detail={true}/>
			<StockPosition {...{symbol}} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default StockDetail;